import { SkillNode } from '../models/SkillNode';

export type TreeState = {
  pointsSpent: number;
  allocations: Record<string, number>;
};

// Lower-tier point totals required before each tier unlocks.
export const TIER_REQUIREMENTS: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 6,
  5: 10,
};

// Cost to allocate skill
export function getSkillPointCost(tier: number): number {
  if (tier <= 3) return 1;
  if (tier === 4) return 2;
  return 3;
}

// Counts spent point value in tiers below the target tier.
export function lowerTierPoints(
  targetTier: number,
  allNodes: SkillNode[],
  allocations: Record<string, number>
): number {
  return allNodes
    .filter(n => n.tier < targetTier)
    .reduce((sum, n) => sum + ((allocations[n.id] ?? 0) > 0 ? getSkillPointCost(n.tier) : 0), 0);
}

// Sibling upgrade paths are mutually exclusive once one child is allocated.
export const getBlockingSibling = (
  node: SkillNode,
  allNodes: SkillNode[],
  allocations: Record<string, number>
): SkillNode | null => {
  if (!node.requires) return null;

  return allNodes.find(other =>
    other.id !== node.id &&
    other.requires === node.requires &&
    (allocations[other.id] ?? 0) > 0
  ) ?? null;
};

// A skill can unlock only when its dependency, tier, and sibling gates are clear.
export const canUnlock = (node: SkillNode, allNodes: SkillNode[], state: TreeState | undefined): boolean => {
  const allocations = state?.allocations ?? {};
  const depsMet = !node.requires || (allocations[node.requires] ?? 0) > 0;
  const required = node.tier == null ? 0 : (TIER_REQUIREMENTS[node.tier] ?? 0);
  const tierOk = lowerTierPoints(node.tier, allNodes, allocations) >= required;
  const siblingBlocked = getBlockingSibling(node, allNodes, allocations) !== null;
  return depsMet && tierOk && !siblingBlocked;
};

// Checks whether removing a point would break dependencies or tier gates.
export const canDeallocate = (node: SkillNode, allNodes: SkillNode[], state: TreeState): boolean => {
  // Simulate the removal before validating the remaining allocated skills.
  const newAllocations = { ...state.allocations };
  if ((newAllocations[node.id] ?? 0) <= 1) {
    delete newAllocations[node.id];
  } else {
    newAllocations[node.id] -= 1;
  }

  for (const other of allNodes) {
    if (other.id === node.id) continue;
    if ((newAllocations[other.id] ?? 0) === 0) continue;
    if (other.requires === node.id) return false;
    const required = other.tier == null ? 0 : (TIER_REQUIREMENTS[other.tier] ?? 0);
    if (lowerTierPoints(other.tier, allNodes, newAllocations) < required) return false;
  }
  return true;
};
