import React, { createContext, useContext, useState } from 'react';
import { getSkillPointCost } from '../utils/CanUnlock';

export type TreeState = {
  pointsSpent: number;
  allocations: Record<string, number>;
};

type TalentTreeContextType = {
  treeStates: Record<string, TreeState>;
  selectedTab: string;
  selectTab: (tab: string) => void;
  allocatePoint: (skillId: string, tier: number) => void;
  deallocatePoint: (skillId: string, tier: number) => void;
  totalPointsSpent: number;
  level: number;
  setLevel: (level: number) => void;
  availablePoints: number;
  resetCurrentTree: () => void;
  resetAllTrees: () => void;
};

const TalentTreeContext = createContext<TalentTreeContextType | undefined>(undefined);

// Stores point allocations for each tree and the shared character level.
export const TalentTreeProvider = ({ children }: { children: React.ReactNode }) => {
  const [treeStates, setTreeStates] = useState<Record<string, TreeState>>({});
  const [selectedTab, setSelectedTab] = useState<string>('Fire');
  const [level, setLevelState] = useState<number>(30);

  const totalPointsSpent = Object.values(treeStates).reduce(
    (sum, tree) => sum + (tree?.pointsSpent ?? 0),
    0
  );

  // Level 1 starts with 3 points, then each level adds 1.
  const availablePoints = level + 2;

  const setLevel = (newLevel: number) => {
    const clampedLevel = Math.max(1, Math.min(30, newLevel));
    setLevelState(clampedLevel);
  };

  const selectTab = (tab: string) => {
    setSelectedTab(tab);
  };

  // Allocates a skill in the selected tree if the global point budget allows it.
  const allocatePoint = (skillId: string, tier: number) => {
    setTreeStates((prev) => {
      const totalSpentBefore = Object.values(prev).reduce(
        (sum, tree) => sum + (tree?.pointsSpent ?? 0),
        0
      );
      const currentTree = prev[selectedTab] || { pointsSpent: 0, allocations: {} };
      const currentPoints = currentTree.allocations[skillId] || 0;
      const pointCost = getSkillPointCost(tier);
      if (totalSpentBefore + pointCost > availablePoints) return prev;

      return {
        ...prev,
        [selectedTab]: {
          pointsSpent: currentTree.pointsSpent + pointCost,
          allocations: {
            ...currentTree.allocations,
            [skillId]: currentPoints + 1,
          },
        },
      };
    });
  };

  // Removes a skill allocation from the selected tree and clears empty entries.
  const deallocatePoint = (skillId: string, tier: number) => {
    setTreeStates((prev) => {
      const currentTree = prev[selectedTab];
      if (!currentTree || !currentTree.allocations[skillId]) return prev;
      const pointCost = getSkillPointCost(tier);

      const updatedAllocations = { ...currentTree.allocations };
      updatedAllocations[skillId] = updatedAllocations[skillId] - 1;
      if (updatedAllocations[skillId] <= 0) delete updatedAllocations[skillId];

      return {
        ...prev,
        [selectedTab]: {
          pointsSpent: currentTree.pointsSpent - pointCost,
          allocations: updatedAllocations,
        },
      };
    });
  };

  // Removes only the selected tree's allocation state.
  const resetCurrentTree = () => {
    setTreeStates((prev) => {
      if (!prev[selectedTab]) return prev;

      const next = { ...prev };
      delete next[selectedTab];
      return next;
    });
  };

  const resetAllTrees = () => {
    setTreeStates({});
  };

  return (
    <TalentTreeContext.Provider
      value={{
        treeStates,
        selectedTab,
        selectTab,
        allocatePoint,
        deallocatePoint,
        totalPointsSpent,
        level,
        setLevel,
        availablePoints,
        resetCurrentTree,
        resetAllTrees,
      }}
    >
      {children}
    </TalentTreeContext.Provider>
  );
};

export const useTalentTree = () => {
  const context = useContext(TalentTreeContext);
  if (!context) {
    throw new Error('useTalentTree must be used inside TalentTreeProvider');
  }
  return context;
};
