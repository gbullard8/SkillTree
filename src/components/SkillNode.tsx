import { type CSSProperties, useLayoutEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { SkillNode } from '../models/SkillNode';
import { EQUIPMENT_TYPE_NAMES } from '../models/Action';
import { useTalentTree } from '../context/TalentTreeContext';
import { canUnlock, canDeallocate, getBlockingSibling, lowerTierPoints, TIER_REQUIREMENTS, getSkillPointCost } from '../utils/CanUnlock';
import { parseDescription } from '../utils/parseDescription';
import { applyDamageRange } from '../utils/computeDamageRange';
import { STATUS_EFFECTS } from '../data/statusEffects';
import { SPECIAL_BLAST_RADIUS_SKILLS, SPECIAL_RANGE_SKILLS, DURATION_OVERRIDE, AP_COST_OVERRIDE } from '../data/specialValues';
import { getNodeLeft, getNodeTop } from '../utils/treeCanvasLayout';
import { assetUrl, skillIconUrl } from '../utils/assetUrl';
import './SkillNode.css';


type Props = {
  node: SkillNode;
  allNodes: SkillNode[];
};

const TOOLTIP_BASE_WIDTH = 380;

// Touch devices use centered modal-style tooltips instead of hover placement.
const shouldCenterTooltip = () =>
  window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth <= 1024;

const SkillNodeComponent = ({ node, allNodes }: Props) => {
  const { selectedTab, treeStates, allocatePoint, deallocatePoint } = useTalentTree();
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number; right: number; bottom: number; scale: number; centered: boolean } | null>(null);
  const [tooltipLayout, setTooltipLayout] = useState<{ left: number; top: number } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const treeState = treeStates[selectedTab];
  const allocatedPoints = treeState?.allocations[node.id] || 0;
  const isUnlocked = allocatedPoints > 0;
  const isAvailable = canUnlock(node, allNodes, treeState);
  const canApplyPoint = !isUnlocked && isAvailable;
  const canUnlearnPoint = isUnlocked && !!treeState && canDeallocate(node, allNodes, treeState);
  const canUseMobilePrimaryAction = canApplyPoint || canUnlearnPoint;

  // Capture node bounds before the tooltip is portaled to document.body.
  const showTooltip = () => {
    if (!nodeRef.current) return;

    const rect = nodeRef.current.getBoundingClientRect();
    const nodeScale = rect.width / 64;
    const centeredTooltip = shouldCenterTooltip();
    const maxViewportScale = (window.innerWidth * 0.9) / TOOLTIP_BASE_WIDTH;

    setTooltipLayout(null);
    setTooltipPos({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      scale: centeredTooltip ? Math.min(nodeScale, maxViewportScale) : nodeScale,
      centered: centeredTooltip,
    });
  };

  const closeTooltip = () => {
    setTooltipPos(null);
    setTooltipLayout(null);
  };

  const handleClick = () => {
    if (shouldCenterTooltip()) {
      showTooltip();
      return;
    }

    if (isUnlocked) {
      if (treeState && canDeallocate(node, allNodes, treeState)) {
        deallocatePoint(node.id, node.tier);
      }
    } else if (isAvailable) {
      allocatePoint(node.id, node.tier);
    }
  };

  const handleMouseEnter = () => {
    if (shouldCenterTooltip()) return;
    showTooltip();
  };

  const handleMouseLeave = () => {
    if (shouldCenterTooltip()) return;
    closeTooltip();
  };

  let nodeClass = 'skill-node';
  if (isUnlocked) nodeClass += ' allocated';
  else if (isAvailable) nodeClass += ' unlocked';
  else nodeClass += ' locked';

  // Build formatted description nodes and collect status names mentioned in text.
  const { nodes: descNodes, statuses: rawStatuses } = parseDescription(applyDamageRange(node.skill.description || '', node));
  const statusKeyMap = Object.fromEntries(Object.keys(STATUS_EFFECTS).map(k => [k.toLowerCase(), k]));
  const lookupStatus = (name: string) => STATUS_EFFECTS[statusKeyMap[name.toLowerCase()]];
  const statuses = rawStatuses.filter(name => lookupStatus(name) !== undefined);

  const parentNode = node.requires ? allNodes.find(n => n.id === node.requires) : null;
  const parentName = parentNode?.skill.skillName ?? null;

  const allocations = treeState?.allocations ?? {};
  // Precompute tooltip requirement messages for unavailable skills.
  const blockingSibling = getBlockingSibling(node, allNodes, allocations);
  const tierRequired = TIER_REQUIREMENTS[node.tier] ?? 0;
  const pointsInLowerTiers = lowerTierPoints(node.tier, allNodes, allocations);
  const tierMet = pointsInLowerTiers >= tierRequired;
  const parentMet = !node.requires || (allocations[node.requires] ?? 0) > 0;

  // Some elemental passives imply statuses even when the text omits the marker.
  const DAMAGE_TYPE_STATUS: Record<number, { label: string; status: string }> = {
    2: { label: 'All fire damage applies', status: 'Heat' },
    3: { label: 'All frost damage applies', status: 'Chilled' },
    4: { label: 'All lightning damage applies', status: 'Shocked' },
  };
  const damageTypeEntry = node.skill.damageType != null ? DAMAGE_TYPE_STATUS[node.skill.damageType] ?? null : null;
  const damageStatus = damageTypeEntry && (node.skill.skillTags.includes(8) || statuses.includes(damageTypeEntry.status))
    ? damageTypeEntry
    : null;

  // Measure the rendered tooltip, then clamp it into the viewport.
  useLayoutEffect(() => {
    if (!tooltipPos || !tooltipRef.current) return;

    const margin = 8 * tooltipPos.scale;
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    if (tooltipPos.centered) {
      setTooltipLayout({
        left: Math.max(margin, (window.innerWidth - tooltipRect.width) / 2),
        top: Math.max(margin, (window.innerHeight - tooltipRect.height) / 2),
      });
      return;
    }

    const clampedLeft = Math.min(
      Math.max(tooltipPos.left, margin),
      window.innerWidth - tooltipRect.width - margin
    );
    let top = tooltipPos.top - tooltipRect.height - margin;

    if (top < margin) {
      top = tooltipPos.bottom + margin;
    }

    if (top + tooltipRect.height > window.innerHeight - margin) {
      top = Math.max(margin, window.innerHeight - tooltipRect.height - margin);
    }

    setTooltipLayout({ left: clampedLeft, top });
  }, [tooltipPos]);

  const tooltip = tooltipPos && ReactDOM.createPortal(
    <>
      {tooltipPos.centered && (
        <div
          className="skill-tooltip-backdrop"
          onPointerDown={closeTooltip}
          onClick={closeTooltip}
          aria-hidden="true"
        />
      )}
      <div
        ref={tooltipRef}
        className="skill-tooltip"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          left: tooltipLayout?.left ?? tooltipPos.left,
          top: tooltipLayout?.top ?? tooltipPos.top,
          visibility: tooltipLayout ? 'visible' : 'hidden',
          '--tooltip-scale': tooltipPos.scale,
        } as CSSProperties}
      >
        <button
          type="button"
          className="tooltip-close"
          aria-label="Close tooltip"
          onClick={(e) => {
            e.stopPropagation();
            closeTooltip();
          }}
        />
        <div className="tooltip-header">
          <span className="tooltip-icon-frame" aria-hidden="true">
            <img className="tooltip-icon" src={skillIconUrl(node.skill.id)} alt=""
              onError={(e) => { if (node.requires) (e.target as HTMLImageElement).src = assetUrl(`/icons/${node.requires}.png`); }} />
          </span>
          <div className="tooltip-title">{node.skill.skillName}</div>
        </div>
        <div className="tooltip-divider" />

        {isAvailable ? (
          <div className="tooltip-select-to-learn-text">{isUnlocked ? 'Select to Unlearn' : 'Select to Learn'}</div>
        ) : blockingSibling ? (
          <div className="tooltip-requires-more-points">Disabled by {blockingSibling.skill.skillName}</div>
        ) : !tierMet ? (
          <div className="tooltip-requires-more-points">Requires {tierRequired} points in previous tiers</div>
        ) : !parentMet ? (
          <div className="tooltip-requires-more-points">Requires {parentName}</div>
        ) : null}
        <div className="tooltip-cost">Skill Point Cost: {getSkillPointCost(node.tier)}</div>

        <div className="tooltip-desc">{descNodes}</div>

        {parentName && !node.isPassive && (
          <div className="tooltip-weapon-req">Replaces {parentName}</div>
        )}

        {node.actions[0]?.hasWeaponRequirement && (
          <div className="tooltip-weapon-req">
            Requires {node.actions[0].hasWeaponRequirementTypes && node.actions[0].requiredWeaponTypes.length > 0
              ? node.actions[0].requiredWeaponTypes.map(t => EQUIPMENT_TYPE_NAMES[t] ?? t).join(', ')
              : 'Melee Weapon'}
          </div>
        )}

        {damageStatus && (
          <div className="tooltip-damage-applies">{damageStatus.label} <span className="tooltip-status-name">{damageStatus.status}</span></div>
        )}

        {!node.isPassive && (
          <div className="tooltip-stats">
            <div>AP Cost: {(() => { const ov = AP_COST_OVERRIDE[node.skill.id]; if (ov !== undefined) return ov > 0 ? ov : 'None'; return Number(node.actions[0]?.cost) > 0 ? node.actions[0]?.cost : 'None'; })()}</div>
            {(() => {
              const se = node.actions[0]?.statusEffects[0];
              const simpleStatusDuration = se && (se.infinite || !isNaN(Number(se.duration)));
              const groundDur = node.actions[0]?.useGroundEffect && (node.actions[0]?.groundDuration ?? 0) > 0;
              const hardcoded = DURATION_OVERRIDE[node.skill.id];
              if (hardcoded === 0) return null;
              if (hardcoded === undefined && !simpleStatusDuration && !groundDur) return null;
              const durLabel = (n: number | string) => Number(n) === 1 ? '1 turn' : `${n} turns`;
              const value = hardcoded !== undefined ? durLabel(hardcoded)
                : simpleStatusDuration ? (se!.infinite ? 'Infinite' : durLabel(se!.duration))
                  : durLabel(node.actions[0]?.groundDuration ?? 0);
              return <div>Duration: {value}</div>;
            })()}
            <div>Range: {SPECIAL_RANGE_SKILLS.has(node.skill.id) ? 'Special' : node.actions[0]?.simpleRange === 0 ? 'Self' : node.actions[0]?.simpleRange === 1 ?
              'Melee' : node.actions[0]?.simpleRange}</div>
            {(SPECIAL_BLAST_RADIUS_SKILLS.has(node.skill.id) || (node.actions[0]?.simpleBlastRange ?? 0) > 0) && (
              <div>Blast Radius: {SPECIAL_BLAST_RADIUS_SKILLS.has(node.skill.id) ? 'Special' : node.actions[0]?.simpleBlastRange}</div>
            )}
            <div>Mana Cost: {node.actions[0]?.deactivatable ? '5 mana per turn' :
              node.actions[0]?.manaCost === 1 ? 'None' : node.actions[0]?.costsMana ? node.actions[0]?.manaCost
                : 'None'}</div>
            <div>Cooldown: {Number(node.actions[0]?.cooldown) === 0 ? 'None' : node.actions[0]?.cooldown}</div>
          </div>
        )}
        {(statuses.length > 0 || damageStatus) && (
          <div className="tooltip-statuses">
            {statuses.map(name => (
              <div key={name} className="tooltip-status-entry">
                <span className="tooltip-status-name">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                <span className="tooltip-status-desc">{lookupStatus(name)}</span>
              </div>
            ))}
            {damageStatus && !statuses.some(s => s.toLowerCase() === damageStatus.status.toLowerCase()) && (
              <div className="tooltip-status-entry">
                <span className="tooltip-status-name">{damageStatus.status}</span>
                <span className="tooltip-status-desc">{lookupStatus(damageStatus.status) ?? ''}</span>
              </div>
            )}
          </div>
        )}

        <div className="tooltip-mobile-actions">
          <button
            type="button"
            className="tooltip-mobile-action"
            disabled={!canUseMobilePrimaryAction}
            onClick={(e) => {
              e.stopPropagation();
              if (canApplyPoint) {
                allocatePoint(node.id, node.tier);
              } else if (canUnlearnPoint) {
                deallocatePoint(node.id, node.tier);
              } else {
                return;
              }
              closeTooltip();
            }}
          >
            {isUnlocked ? 'Unlearn' : 'Apply'}
          </button>
          <button
            type="button"
            className="tooltip-mobile-action"
            onClick={(e) => {
              e.stopPropagation();
              closeTooltip();
            }}
          >
            Close
          </button>
        </div>

      </div>
    </>,
    document.body
  );

  return (
    <div
      ref={nodeRef}
      className={nodeClass}
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        left: `${getNodeLeft(node, allNodes)}px`,
        top: `${getNodeTop(node)}px`,
        position: 'absolute',
      }}
    >
      <div className="skill-node-inner">
        <span className="skill-icon-art" aria-hidden="true">
          <img className='skill-icon'
            src={skillIconUrl(node.skill.id)}
            alt={`${node.skill.id}  (${node.skill.skillName})`}
            draggable={false}
            onError={(e) => { if (node.requires) (e.target as HTMLImageElement).src = assetUrl(`/icons/${node.requires}.png`); }}
          />
        </span>
      </div>
      {tooltip}
    </div>
  );
};

export default SkillNodeComponent;
