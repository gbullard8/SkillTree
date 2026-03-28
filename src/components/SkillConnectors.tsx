import { useEffect, useState } from 'react';
import { SkillNode } from '../models/SkillNode';

type Props = {
  nodes: SkillNode[];
};

const SkillConnectors = ({ nodes }: Props) => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const onResize = () => forceUpdate(n => n + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const vw = window.innerWidth / 100;
  const vh = window.innerHeight / 100;
  const nodeWidth = 4.2 * vw; // matches .skill-node width: 4.2vw, aspect-ratio 1/1

  const getNodePos = (node: SkillNode) => {
    const left = (node.xVal / 1920) * 10000 * vw;
    const top = (node.tier / 1080) * 12000 * vh + 10 * vh; // +10vh matches margin-top on .skill-node
    return {
      topCenterX: left + nodeWidth / 2,
      topCenterY: top,
      botCenterX: left + nodeWidth / 2,
      botCenterY: top + nodeWidth,
    };
  };

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  const lines = nodes
    .filter(n => n.requires && nodeMap.has(n.requires))
    .map(n => {
      const from = getNodePos(n);
      const to = getNodePos(nodeMap.get(n.requires!)!);
      return {
        key: n.id,
        x1: from.topCenterX, y1: from.topCenterY,
        x2: to.botCenterX,   y2: to.botCenterY,
      };
    });

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 0,
      }}
    >
      {lines.map(({ key, x1, y1, x2, y2 }) => (
        <line
          key={key}
          x1={x1} y1={y1}
          x2={x2} y2={y2}
          stroke="#c8b48a"
          strokeWidth={3}
        />
      ))}
    </svg>
  );
};

export default SkillConnectors;
