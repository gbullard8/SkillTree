import { Skill } from "./Skill";
import { Action } from "./Action";

export type SkillNode = {
    id: string;
    skill: Skill;
    actions: Action[];
    requires?: string;
    xVal: number;
    tier: number;
    isPassive: boolean
  };

  export type SkillTree = {
    name: string;
    nodes: SkillNode[];
  };

  export type SkillTrees = Record<string, SkillTree>