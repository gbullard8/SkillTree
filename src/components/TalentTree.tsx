import { type CSSProperties, useMemo, useEffect, useRef, useState } from 'react';
import { useTalentTree } from '../context/TalentTreeContext';
import { loadSkillTrees } from '../services/LoadSkillTrees';
import SkillNodeComponent from './SkillNode';
import SkillConnectors from './SkillConnectors';
import TabSelector from './TabSelector';
import LevelSelector from './LevelSelector';
import { TREE_CANVAS_HEIGHT, TREE_CANVAS_WIDTH } from '../utils/treeCanvasLayout';
import { skillIconUrl } from '../utils/assetUrl';
import { TAB_IMAGES } from '../data/tabImages';
import './TalentTree.css';

const preloadedImages = new Map<string, HTMLImageElement>();
let preloadStarted = false;

// Display order for the skill-tree tabs.
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

// Designed frame width used to convert container width into a CSS scale.
const DESIGNED_TREE_WIDTH = 1613;
const SKILL_GRID_BASE_SCALE = 1.32;

// Warms icon assets to avoid flicker when switching tabs or opening tooltips.
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

  // Load and normalize the exported skill data once for this component.
  const trees = useMemo(() => loadSkillTrees(), []);

  // Keep the tree art and node canvas scaled to the rendered frame width.
  useEffect(() => {
    if (preloadStarted) return;
    preloadStarted = true;

    for (const tree of Object.values(trees)) {
      for (const node of tree.nodes) {
        preloadImage(skillIconUrl(node.skill.id));
      }
    }

    for (const src of Object.values(TAB_IMAGES)) {
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
  const remainingPoints = availablePoints - totalPointsSpent;

  // Counter values shown on each tab.
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
        <TabSelector
          tabs={tabs}
          selected={selectedTab}
          onSelect={selectTab}
          pointCounts={tabPointCounts}
        />
      </div>

      <div className={`points-remaining-banner ${remainingPoints === 0 ? 'points-remaining-empty' : ''}`}>
        <span>Points Remaining: {remainingPoints}</span>
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
