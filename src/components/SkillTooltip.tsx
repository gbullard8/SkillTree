import { type CSSProperties, type RefObject } from 'react';
import ReactDOM from 'react-dom';
import { SkillNode } from '../models/SkillNode';
import { EQUIPMENT_TYPE_NAMES } from '../models/Action';
import { type TreeState } from '../context/TalentTreeContext';
import {
  getBlockingSibling,
  getSkillPointCost,
  lowerTierPoints,
  TIER_REQUIREMENTS,
} from '../utils/canUnlock';
import { parseDescription } from '../utils/parseDescription';
import { applyDamageRange } from '../utils/computeDamageRange';
import { STATUS_EFFECTS } from '../data/statusEffects';
import {
  AP_COST_OVERRIDE,
  DURATION_OVERRIDE,
  SPECIAL_BLAST_RADIUS_SKILLS,
  SPECIAL_RANGE_SKILLS,
} from '../data/specialValues';
import { assetUrl, skillIconUrl } from '../utils/assetUrl';
import { SkillTooltipAnchor, SkillTooltipLayout } from './useSkillTooltipPosition';

type Props = {
  node: SkillNode;
  allNodes: SkillNode[];
  treeState: TreeState | undefined;
  isAvailable: boolean;
  isUnlocked: boolean;
  canApplyPoint: boolean;
  canUnlearnPoint: boolean;
  tooltipRef: RefObject<HTMLDivElement | null>;
  tooltipPos: SkillTooltipAnchor | null;
  tooltipLayout: SkillTooltipLayout | null;
  closeTooltip: () => void;
  allocatePoint: (skillId: string, tier: number) => void;
  deallocatePoint: (skillId: string, tier: number) => void;
};

const getStatusLookup = () => {
  const statusKeyMap = Object.fromEntries(Object.keys(STATUS_EFFECTS).map(k => [k.toLowerCase(), k]));
  return (name: string) => STATUS_EFFECTS[statusKeyMap[name.toLowerCase()]];
};

const formatDuration = (duration: number | string) =>
  Number(duration) === 1 ? '1 turn' : `${duration} turns`;

const getSkillRequirementMessage = (
  node: SkillNode,
  allNodes: SkillNode[],
  allocations: Record<string, number>,
  parentName: string | null
) => {
  const blockingSibling = getBlockingSibling(node, allNodes, allocations);
  if (blockingSibling) return `Disabled by ${blockingSibling.skill.skillName}`;

  const tierRequired = TIER_REQUIREMENTS[node.tier] ?? 0;
  const tierMet = lowerTierPoints(node.tier, allNodes, allocations) >= tierRequired;
  if (!tierMet) return `Requires ${tierRequired} points in previous tiers`;

  const parentMet = !node.requires || (allocations[node.requires] ?? 0) > 0;
  if (!parentMet) return `Requires ${parentName}`;

  return null;
};

const getDurationValue = (node: SkillNode) => {
  const statusEffect = node.actions[0]?.statusEffects[0];
  const simpleStatusDuration = statusEffect && (statusEffect.infinite || !isNaN(Number(statusEffect.duration)));
  const groundDuration = node.actions[0]?.useGroundEffect && (node.actions[0]?.groundDuration ?? 0) > 0;
  const override = DURATION_OVERRIDE[node.skill.id];

  if (override === 0) return null;
  if (override === undefined && !simpleStatusDuration && !groundDuration) return null;

  if (override !== undefined) return formatDuration(override);
  if (simpleStatusDuration) return statusEffect!.infinite ? 'Infinite' : formatDuration(statusEffect!.duration);
  return formatDuration(node.actions[0]?.groundDuration ?? 0);
};

const SkillTooltip = ({
  node,
  allNodes,
  treeState,
  isAvailable,
  isUnlocked,
  canApplyPoint,
  canUnlearnPoint,
  tooltipRef,
  tooltipPos,
  tooltipLayout,
  closeTooltip,
  allocatePoint,
  deallocatePoint,
}: Props) => {
  if (!tooltipPos) return null;

  const allocations = treeState?.allocations ?? {};
  const canUseMobilePrimaryAction = canApplyPoint || canUnlearnPoint;
  const { nodes: descNodes, statuses: rawStatuses } = parseDescription(applyDamageRange(node.skill.description || '', node));
  const lookupStatus = getStatusLookup();
  const statuses = rawStatuses.filter(name => lookupStatus(name) !== undefined);
  const parentNode = node.requires ? allNodes.find(n => n.id === node.requires) : null;
  const parentName = parentNode?.skill.skillName ?? null;
  const requirementMessage = getSkillRequirementMessage(node, allNodes, allocations, parentName);

  // Some elemental passives imply statuses even when the text omits the marker.
  const damageTypeStatus: Record<number, { label: string; status: string }> = {
    2: { label: 'All fire damage applies', status: 'Heat' },
    3: { label: 'All frost damage applies', status: 'Chilled' },
    4: { label: 'All lightning damage applies', status: 'Shocked' },
  };
  const damageTypeEntry = node.skill.damageType != null ? damageTypeStatus[node.skill.damageType] ?? null : null;
  const damageStatus = damageTypeEntry && (node.skill.skillTags.includes(8) || statuses.includes(damageTypeEntry.status))
    ? damageTypeEntry
    : null;
  const durationValue = getDurationValue(node);

  return ReactDOM.createPortal(
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
            <img
              className="tooltip-icon"
              src={skillIconUrl(node.skill.id)}
              alt=""
              onError={(e) => { if (node.requires) (e.target as HTMLImageElement).src = assetUrl(`/icons/${node.requires}.png`); }}
            />
          </span>
          <div className="tooltip-title">{node.skill.skillName}</div>
        </div>
        <div className="tooltip-divider" />

        {isAvailable ? (
          <div className="tooltip-select-to-learn-text">{isUnlocked ? 'Select to Unlearn' : 'Select to Learn'}</div>
        ) : requirementMessage ? (
          <div className="tooltip-requires-more-points">{requirementMessage}</div>
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
            <div>AP Cost: {(() => {
              const override = AP_COST_OVERRIDE[node.skill.id];
              if (override !== undefined) return override > 0 ? override : 'None';
              return Number(node.actions[0]?.cost) > 0 ? node.actions[0]?.cost : 'None';
            })()}</div>
            {durationValue && <div>Duration: {durationValue}</div>}
            <div>Range: {SPECIAL_RANGE_SKILLS.has(node.skill.id) ? 'Special' : node.actions[0]?.simpleRange === 0 ? 'Self' : node.actions[0]?.simpleRange === 1 ? 'Melee' : node.actions[0]?.simpleRange}</div>
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
};

export default SkillTooltip;
