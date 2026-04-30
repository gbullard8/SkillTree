// src/components/TalentTree.tsx

import { type CSSProperties, useMemo, useEffect, useRef, useState } from 'react';
import { useTalentTree } from '../context/TalentTreeContext';
import { loadSkillTrees } from '../services/LoadSkillTrees';
import SkillNodeComponent from './SkillNode';
import SkillConnectors from './SkillConnectors';
import TabSelector from './TabSelector';
import LevelSelector from './LevelSelector';
import { TREE_CANVAS_HEIGHT, TREE_CANVAS_WIDTH } from '../utils/treeCanvasLayout';
import { assetUrl } from '../utils/assetUrl';
import './TalentTree.css';

const preloadedImages = new Map<string, HTMLImageElement>();
let preloadStarted = false;

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

const tabImages: Record<string, string> = {
  Fire: assetUrl('/icons/aura_of_flame.png'),
  Lightning: assetUrl('/icons/enchant_lightning.png'),
  Cold: assetUrl('/icons/mass_freeze.png'),
  Warrior: assetUrl('/icons/colossus.png'),
  Light: assetUrl('/icons/mass_cure.png'),
  Ranger: assetUrl('/icons/tabs/Ranger.PNG'),
  Shadow: assetUrl('/icons/soul_exchange.png'),
  Thief: assetUrl('/icons/poison_weapon.png'),
  Monk: assetUrl('/icons/meditation.png'),
  Nature: assetUrl('/icons/mass_entangle.png'),
  Chaos: assetUrl('/icons/perturb.png'),
};

const DESIGNED_TREE_WIDTH = 1613;
const SKILL_GRID_BASE_SCALE = 1.32;

const preloadImage = (src: string) => {
  if (preloadedImages.has(src)) return;

  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  preloadedImages.set(src, img);

  if (img.complete) {
    void img.decode?.().catch(() => undefined);
    return;
  }

  img.onload = () => {
    void img.decode?.().catch(() => undefined);
  };
};

const TalentTree = () => {
  const {
    selectedTab,
    selectTab,
    totalPointsSpent,
    availablePoints,
    treeStates,
    resetCurrentTree,
    resetAllTrees,
  } = useTalentTree();
  const [treeScale, setTreeScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const trees = useMemo(() => loadSkillTrees(), []);

  useEffect(() => {
    if (preloadStarted) return;
    preloadStarted = true;

    for (const tree of Object.values(trees)) {
      for (const node of tree.nodes) {
        preloadImage(assetUrl(`/icons/${node.skill.id}.png`));
      }
    }

    for (const src of Object.values(tabImages)) {
      preloadImage(src);
    }
  }, [trees]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      setTreeScale(container.clientWidth / DESIGNED_TREE_WIDTH);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const skillTree = trees[selectedTab];
  const tabPointCounts = useMemo(
    () =>
      Object.fromEntries(
        tabs.map((tab) => [tab, treeStates[tab]?.pointsSpent ?? 0])
      ) as Record<string, number>,
    [treeStates]
  );

  if (!skillTree) {
    return <p>Unknown talent tree: {selectedTab}</p>;
  }

  return (
    <div
      ref={containerRef}
      className="talent-tree-container"
      style={{ '--talent-scale': treeScale } as CSSProperties}
    >
      <div className="talent-tree-topbar">
        <div className="topbar-title">Skill Tree Calculator</div>
        <div className="points-spent">
          <LevelSelector />
        </div>
      </div>

      <div className="tab-header-container">
        <div className="tab-reset-actions">
          <button className="tab-reset-button" type="button" onClick={resetCurrentTree}>
            Reset Tree
          </button>
          <button className="tab-reset-button" type="button" onClick={resetAllTrees}>
            Reset All
          </button>
        </div>
        <TabSelector tabs={tabs} selected={selectedTab} onSelect={selectTab} pointCounts={tabPointCounts} />
      </div>

      <div className={`points-remaining-banner ${availablePoints - totalPointsSpent === 0 ? 'points-remaining-empty' : ''}`}>
        <span>Points Remaining: {availablePoints - totalPointsSpent}</span>
      </div>

      <div className="active-passive-banner" aria-hidden="true">
        <span className="active-passive-label active-label">
          <span className="active-passive-label-text">Active Skills</span>
        </span>
        <span className="active-passive-label passive-label">
          <span className="active-passive-label-text">Passive Skills</span>
        </span>
      </div>

      <div className="talent-tree-body">
        <div className="skill-tree-viewport">
          <div
            className="skill-tree-grid"
            style={{
              width: `${TREE_CANVAS_WIDTH}px`,
              height: `${TREE_CANVAS_HEIGHT}px`,
              transform: `translateX(-50%) scale(${treeScale * SKILL_GRID_BASE_SCALE})`,
            }}
          >
            <SkillConnectors nodes={skillTree.nodes} />
            {skillTree.nodes.map((node) => (
              <SkillNodeComponent key={node.id} node={node} allNodes={skillTree.nodes} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentTree;
