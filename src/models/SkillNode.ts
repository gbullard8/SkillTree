import { Skill } from "./Skill";
import { Action } from "./Action";

export type SkillTree = {
    name: string;
    nodes: SkillNode[];
  };

// Positioned skill plus dependency metadata for rendering a tree.
export type SkillNode = {
    id: string;
    skill: Skill;
    actions: Action[];
    requires?: string;
    xVal: number;
    tier: number;
    isPassive: boolean
  };

  export type SkillTrees = Record<string, SkillTree>
