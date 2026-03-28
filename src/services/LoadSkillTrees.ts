import raw from '../data/SkillData.json'
import { TREE_ID_TO_NAME } from '../data/treeMap'
import { Skill } from '../models/Skill'
import { SkillTrees } from '../models/SkillNode'
import { Action } from '../models/Action'
import { USE_LAST_ACTION_SKILLS } from '../data/specialValues'

function toSkillId(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

export function loadSkillTrees(): SkillTrees {
  const trees: SkillTrees = {}

  for (const entry of raw.skills) {
    const rawSkill = entry.Skill
    
    const skill: Skill = {
      id: toSkillId(rawSkill.SkillName),
      skillName: rawSkill.SkillName,
      description: rawSkill.Description,
      skillType: rawSkill.SkillType,
      damageType: rawSkill.DamageType,
      skillTags: rawSkill.SkillTags,
      iconName: rawSkill.iconName,
      isPassive: rawSkill.IsPassive 
  }

    if (rawSkill.DontIncludeInTree) continue

    const treeName = TREE_ID_TO_NAME[skill.skillType]

    if (!treeName) {
      console.warn(`Unknown tree id: ${skill.skillType} (${skill.skillName})`)
      continue
    }

    if (!trees[treeName]) {
      trees[treeName] = { name: treeName, nodes: [] }
    }

    var xValBase = rawSkill.xVal;
    if(skill.isPassive){
      xValBase = xValBase + 5.5; // xVal=1 nearest center, increasing rightward
    }else{
      xValBase = 6.0 - xValBase; // mirror: xVal=1 nearest center, increasing leftward
    }

    

    trees[treeName].nodes.push({
      skill,
      actions: (USE_LAST_ACTION_SKILLS.has(skill.id) ? entry.Actions.slice(-1) : entry.Actions).map((a: any) => new Action(a)),
      id: skill.id,
      xVal: xValBase,
      tier: rawSkill.Tier,
      isPassive: rawSkill.IsPassive,
      requires: rawSkill.Dependency
        ? toSkillId(rawSkill.Dependency)
        : undefined,
    })
  }

  return trees
}



