import { Action } from './Action'

export class RawSkill {
    skillName: string;
    description: string;
    skillType: number;
    damageType?: number;
    skillTags: number[];
    actions: Action[];
    level: number;
    tier: number;
    xVal: number;
    iconName: string;
    dontIncludeInTree: boolean;
    forceShowGlobalStatusDesc: boolean;
    isPassive: boolean;

  
    constructor(data: any) {
      const skillData = data.Skill;
      this.skillName = skillData.SkillName;
      this.description = skillData.Description;
      this.skillType = skillData.SkillType;
      this.damageType = skillData.DamageType;
      this.skillTags = skillData.SkillTags ?? [];
      this.level = skillData.level;
      this.actions = (data.Actions ?? []).map((a: any) => new Action(a));
      this.tier = skillData.tier;
      this.xVal = skillData.xVal;
      this.iconName = skillData.iconName;
      this.dontIncludeInTree = skillData.dontIncludeInTree;
      this.forceShowGlobalStatusDesc = skillData.forceShowGlobalStatusDesc
      this.isPassive = skillData.isPassive;
    }
  }