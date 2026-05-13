import { SkillNode } from '../models/SkillNode';

// Shared canvas constants keep nodes, connectors, and responsive scaling aligned.
export const TREE_CANVAS_WIDTH = 1120;
export const TREE_CANVAS_HEIGHT = 800;
export const TREE_NODE_SIZE = 64;
export const TREE_CENTER_X = TREE_CANVAS_WIDTH / 2;
// xVal coordinate that maps to the canvas center.
export const TREE_CENTER_XVAL = 5.75;
export const TREE_X_STEP = 88;
export const TREE_TOP_OFFSET = -70;
export const TREE_TIER_STEP = 84;

// Converts a node's xVal layout coordinate into an unadjusted canvas center.
const getBaseNodeCenterX = (node: SkillNode) =>
  TREE_CENTER_X + (node.xVal - TREE_CENTER_XVAL) * TREE_X_STEP;

// Recenters two-child branches under their parent after collision adjustment.
export const getNodeCenterX = (node: SkillNode, allNodes: SkillNode[]) => {
  const baseCenterX = getBaseNodeCenterX(node);
  if (!node.requires) {
    return baseCenterX;
  }

  const siblings = allNodes
    .filter((other) => other.requires === node.requires)
    .sort((a, b) => a.xVal - b.xVal);

  if (siblings.length !== 2) {
    return baseCenterX;
  }

  const parent = allNodes.find((other) => other.id === node.requires);
  if (!parent) {
    return baseCenterX;
  }

  const siblingIndex = siblings.findIndex((other) => other.id === node.id);
  if (siblingIndex === -1) {
    return baseCenterX;
  }

  const parentCenterX = getBaseNodeCenterX(parent);
  const siblingCenters = siblings.map(getBaseNodeCenterX);
  const pairMidpoint = (siblingCenters[0] + siblingCenters[1]) / 2;
  const pairShift = parentCenterX - pairMidpoint;

  return siblingCenters[siblingIndex] + pairShift;
};

export const getNodeLeft = (node: SkillNode, allNodes: SkillNode[]) =>
  getNodeCenterX(node, allNodes) - TREE_NODE_SIZE / 2;

export const getNodeTop = (node: SkillNode) =>
  TREE_TOP_OFFSET + node.tier * TREE_TIER_STEP;
