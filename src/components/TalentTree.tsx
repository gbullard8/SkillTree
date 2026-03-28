// src/components/TalentTree.tsx

import { useMemo, useEffect, useState } from 'react';
import { useTalentTree } from '../context/TalentTreeContext';
import { loadSkillTrees } from '../services/LoadSkillTrees';
import SkillNodeComponent from './SkillNode';
import SkillConnectors from './SkillConnectors';
import TabSelector from './TabSelector';
import LevelSelector from './LevelSelector';
import ComparePanel from './ComparePanel';
import './TalentTree.css';

const tabs = [
  'Fire',
  'Lightning',
  'Cold',
  'Warrior',
  'Light',
  'Ranger',
  'Shadow',
  'Thief',
  'Monk',
  'Nature',
  'Chaos',
];

const TalentTree = () => {
  const { selectedTab, selectTab, totalPointsSpent, availablePoints, treeStates } = useTalentTree();
  const [compareMode, setCompareMode] = useState(false);

  // 🔹 Load ALL trees once
  const trees = useMemo(() => loadSkillTrees(), []);

  // 🔹 Preload all skill icons on mount so tab switches are instant
  useEffect(() => {
    for (const tree of Object.values(trees)) {
      for (const node of tree.nodes) {
        const img = new Image();
        img.src = `/icons/${node.skill.id}.png`;
      }
    }
  }, [trees]);

  // 🔹 Select the active tree
  const skillTree = trees[selectedTab];

  // 🔹 Compute shift so the gap between active and passive areas is centered
  const centerShift = useMemo(() => {
    if (!skillTree) return 0;
    const K = 10000 / 1920; // vw per xVal unit
    const nodeWidthVW = 4.2;
    const active = skillTree.nodes.filter(n => !n.isPassive);
    const passive = skillTree.nodes.filter(n => n.isPassive);
    if (!active.length || !passive.length) return 0;
    const maxActiveRightVW = Math.max(...active.map(n => n.xVal * K)) + nodeWidthVW;
    const minPassiveLeftVW = Math.min(...passive.map(n => n.xVal * K));
    return (maxActiveRightVW + minPassiveLeftVW) / 2;
  }, [skillTree]);

  if (!skillTree) {
    return <p>Unknown talent tree: {selectedTab}</p>;
  }

  return (

    <div className="talent-tree-container">
      <div className="talent-tree-topbar">
        <div className="topbar-title">Talent Calculator</div>
        <div className="points-spent">
          <LevelSelector />
          <span>Points Remaining: {availablePoints - totalPointsSpent}</span>
        </div>
      </div>


      <div className="tab-header-container">
        <TabSelector tabs={tabs} selected={selectedTab} onSelect={selectTab} />
        <button
          className="compare-toggle-btn"
          onClick={() => setCompareMode(m => !m)}
        >
          {compareMode ? 'Hide Compare' : 'Compare Mode'}
        </button>
        </div>


        <div className="talent-tree-body">
          <div className="skill-tree-grid" style={{ transform: `translateX(calc(50% - ${centerShift}vw))` }}>
          <SkillConnectors nodes={skillTree.nodes} />
          {skillTree.nodes.map((node) => (
            <SkillNodeComponent key={node.id} node={node} allNodes={skillTree.nodes} />
          ))}
        </div>
      </div>



      {compareMode && (
        <ComparePanel
          nodes={skillTree.nodes}
          treeState={treeStates[selectedTab]}
          onClose={() => setCompareMode(false)}
        />
      )}
    </div>
  );
};

export default TalentTree;


