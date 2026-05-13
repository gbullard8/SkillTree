import { useRef } from 'react';
import { SkillNode } from '../models/SkillNode';
import { useTalentTree } from '../context/TalentTreeContext';
import { canUnlock, canDeallocate } from '../utils/canUnlock';
import { getNodeLeft, getNodeTop } from '../utils/treeCanvasLayout';
import { assetUrl, skillIconUrl } from '../utils/assetUrl';
import SkillTooltip from './SkillTooltip';
import { shouldCenterTooltip, useSkillTooltipPosition } from './useSkillTooltipPosition';
import './SkillNode.css';


type Props = {
  node: SkillNode;
  allNodes: SkillNode[];
};

const SkillNodeComponent = ({ node, allNodes }: Props) => {
  const { selectedTab, treeStates, allocatePoint, deallocatePoint } = useTalentTree();
  const nodeRef = useRef<HTMLDivElement>(null);
  const { tooltipRef, tooltipPos, tooltipLayout, showTooltip, closeTooltip } = useSkillTooltipPosition(nodeRef);

  const treeState = treeStates[selectedTab];
  const allocatedPoints = treeState?.allocations[node.id] || 0;
  const isUnlocked = allocatedPoints > 0;
  const isAvailable = canUnlock(node, allNodes, treeState);
  const canApplyPoint = !isUnlocked && isAvailable;
  const canUnlearnPoint = isUnlocked && !!treeState && canDeallocate(node, allNodes, treeState);

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
      <SkillTooltip
        node={node}
        allNodes={allNodes}
        treeState={treeState}
        isAvailable={isAvailable}
        isUnlocked={isUnlocked}
        canApplyPoint={canApplyPoint}
        canUnlearnPoint={canUnlearnPoint}
        tooltipRef={tooltipRef}
        tooltipPos={tooltipPos}
        tooltipLayout={tooltipLayout}
        closeTooltip={closeTooltip}
        allocatePoint={allocatePoint}
        deallocatePoint={deallocatePoint}
      />
    </div>
  );
};

export default SkillNodeComponent;
