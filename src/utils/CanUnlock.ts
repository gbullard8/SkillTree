import { SkillNode } from '../models/SkillNode';

export type TreeState = {
  pointsSpent: number;
  allocations: Record<string, number>;
};

export const TIER_REQUIREMENTS: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 6,
  5: 10,
};

function lowerTierPoints(targetTier: number, allNodes: SkillNode[], allocations: Record<string, number>): number {
  return allNodes
    .filter(n => n.tier < targetTier)
    .reduce((sum, n) => sum + (allocations[n.id] ?? 0), 0);
}

export const canUnlock = (node: SkillNode, allNodes: SkillNode[], state: TreeState | undefined): boolean => {
  const allocations = state?.allocations ?? {};
  const depsMet = !node.requires || (allocations[node.requires] ?? 0) > 0;
  const required = node.tier == null ? 0 : (TIER_REQUIREMENTS[node.tier] ?? 0);
  const tierOk = lowerTierPoints(node.tier, allNodes, allocations) >= required;
  return depsMet && tierOk;
};

export const canDeallocate = (node: SkillNode, allNodes: SkillNode[], state: TreeState): boolean => {
  // Simulate removing one point from this node
  const newAllocations = { ...state.allocations };
  if ((newAllocations[node.id] ?? 0) <= 1) {
    delete newAllocations[node.id];
  } else {
    newAllocations[node.id] -= 1;
  }

  for (const other of allNodes) {
    if (other.id === node.id) continue;
    if ((newAllocations[other.id] ?? 0) === 0) continue;
    // Block if another allocated skill directly depends on this one
    if (other.requires === node.id) return false;
    // Block if lower-tier points no longer meet this skill's tier requirement
    const required = other.tier == null ? 0 : (TIER_REQUIREMENTS[other.tier] ?? 0);
    if (lowerTierPoints(other.tier, allNodes, newAllocations) < required) return false;
  }
  return true;
};
