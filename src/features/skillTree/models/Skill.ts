// Core skill metadata extracted from the raw skill export.
export class Skill {
    id: string;
    skillName: string;
    description: string;
    skillType: number;
    damageType?: number;
    skillTags: number[];
    iconName: string;
    isPassive: boolean;
    constructor(data: any) {
      const skillData = data.Skill;
      this.id = skillData.id;
      this.skillName = skillData.SkillName;
      this.description = skillData.Description;
      this.skillType = skillData.SkillType;
      this.damageType = skillData.DamageType;
      this.skillTags = skillData.SkillTags ?? [];
      this.iconName = skillData.iconName;
      this.isPassive = skillData.IsPassive;
    }
}
