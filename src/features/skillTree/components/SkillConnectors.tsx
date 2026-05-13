import { SkillNode } from '../models/SkillNode';
import { getNodeCenterX, getNodeTop, TREE_CANVAS_HEIGHT, TREE_CANVAS_WIDTH, TREE_NODE_SIZE } from '../utils/treeCanvasLayout';

type Props = {
  nodes: SkillNode[];
};

// Draws parent-child links behind the skill nodes.
const SkillConnectors = ({ nodes }: Props) => {
  const nodeWidth = TREE_NODE_SIZE;

  const getNodePos = (node: SkillNode) => {
    const centerX = getNodeCenterX(node, nodes);
    const top = getNodeTop(node);
    const connectorInset = nodeWidth * 0.18;

    return {
      topCenterX: centerX,
      topCenterY: top + connectorInset,
      botCenterX: centerX,
      botCenterY: top + nodeWidth - connectorInset,
    };
  };

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const childrenByParent = new Map<string, SkillNode[]>();

  for (const node of nodes) {
    if (!node.requires || !nodeMap.has(node.requires)) continue;
    const siblings = childrenByParent.get(node.requires) ?? [];
    siblings.push(node);
    childrenByParent.set(node.requires, siblings);
  }

  const paths = Array.from(childrenByParent.entries()).flatMap(([parentId, children]) => {
    const parent = nodeMap.get(parentId);
    if (!parent) return [];

    const parentPos = getNodePos(parent);
    const sortedChildren = [...children].sort((a, b) => a.xVal - b.xVal);
    const childPositions = sortedChildren.map(getNodePos);

    return childPositions.map((childPos, index) => ({
      key: `${parentId}-${sortedChildren[index].id}`,
      d: `M ${parentPos.botCenterX} ${parentPos.botCenterY} L ${childPos.topCenterX} ${childPos.topCenterY}`,
    }));
  });

  return (
    <svg
      viewBox={`0 0 ${TREE_CANVAS_WIDTH} ${TREE_CANVAS_HEIGHT}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 0,
      }}
    >
      {paths.map(({ key, d }) => (
        <path
          key={key}
          d={d}
          fill="none"
          stroke="#3c2f22"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {paths.map(({ key, d }) => (
        <path
          key={`${key}-highlight`}
          d={d}
          fill="none"
          stroke="#d6c6ad"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};

export default SkillConnectors;
