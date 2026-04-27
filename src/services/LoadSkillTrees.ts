import raw from '../data/SkillData.json'
import { TREE_ID_TO_NAME } from '../data/treeMap'
import { Skill } from '../models/Skill'
import { SkillNode, SkillTrees } from '../models/SkillNode'
import { Action } from '../models/Action'
import { USE_LAST_ACTION_SKILLS } from '../data/specialValues'

import { TREE_NODE_SIZE, TREE_X_STEP } from '../utils/treeCanvasLayout'

const MIN_GAP_PX = 8
const MIN_STEP = (TREE_NODE_SIZE + MIN_GAP_PX) / TREE_X_STEP  // minimum xVal gap between nodes

const SKILLS_EXCLUDED_FROM_TREE = new Set([
  '0:Fickle Flame',
  '5:Animal Companion Grizzly',
  '5:Beast Master I',
  '5:Beast Master II',
  '5:Summon Raven',
  '5:Summon Wolf',
  '10:Body and Soul',
])

function shouldExcludeFromTree(rawSkill: any) {
  return rawSkill.DontIncludeInTree || SKILLS_EXCLUDED_FROM_TREE.has(`${rawSkill.SkillType}:${rawSkill.SkillName}`)
}

function resolveCollisions(nodes: SkillNode[]) {
  const byId = new Map(nodes.map(n => [n.id, n]))

  const childrenOf = new Map<string, SkillNode[]>()
  for (const n of nodes) {
    if (n.requires) {
      if (!childrenOf.has(n.requires)) childrenOf.set(n.requires, [])
      childrenOf.get(n.requires)!.push(n)
    }
  }

  // Shift a node and all its descendants.
  // Positive delta = move left (active direction); negative delta = move right (passive direction).
  const shiftSubtree = (node: SkillNode, delta: number) => {
    node.xVal -= delta
    for (const child of (childrenOf.get(node.id) ?? [])) shiftSubtree(child, delta)
  }

  // Move a node's whole family unit by delta, keeping centering intact.
  const moveFamily = (node: SkillNode, delta: number) => {
    shiftSubtree(node, delta)
    if (!node.requires) return
    const parent = byId.get(node.requires)
    if (!parent) return
    const siblings = childrenOf.get(node.requires) ?? []
    if (siblings.length === 1) {
      parent.xVal -= delta
    } else if (siblings.length === 2) {
      parent.xVal -= delta
      for (const s of siblings) {
        if (s.id !== node.id) shiftSubtree(s, delta)
      }
    }
  }

  // Fix paired-child spacing.
  // Active pairs: right child (inner/closer to center) is anchor, left moves further left.
  // Passive pairs: left child (inner/closer to center) is anchor, right moves further right.
  const fixPairs = () => {
    for (const children of Array.from(childrenOf.values())) {
      if (children.length !== 2) continue
      children.sort((a: SkillNode, b: SkillNode) => a.xVal - b.xVal)
      const [L, R] = children
      const gap = R.xVal - L.xVal
      if (gap >= MIN_STEP) continue
      const delta = MIN_STEP - gap
      const parent = byId.get(L.requires!)
      if (L.isPassive) {
        shiftSubtree(R, -delta)            // passive: R moves right (away from center)
      } else {
        shiftSubtree(L, delta)             // active: L moves left (away from center)
      }
      if (parent) parent.xVal = (L.xVal + R.xVal) / 2
    }
  }

  const tierGroups = new Map<string, SkillNode[]>()
  for (const n of nodes) {
    const key = `${n.tier}:${n.isPassive}`
    if (!tierGroups.has(key)) tierGroups.set(key, [])
    tierGroups.get(key)!.push(n)
  }

  // Tier-level collision resolution.
  // Active: inner (right) node is anchor — push left nodes further left.
  // Passive: inner (left) node is anchor — push right nodes further right.
  const fixTiers = () => {
    for (const group of Array.from(tierGroups.values())) {
      group.sort((a: SkillNode, b: SkillNode) => a.xVal - b.xVal)
      if (group[0]?.isPassive) {
        for (let i = 0; i < group.length - 1; i++) {
          const gap = group[i + 1].xVal - group[i].xVal
          if (gap < MIN_STEP) moveFamily(group[i + 1], -(MIN_STEP - gap))
        }
      } else {
        for (let i = group.length - 1; i > 0; i--) {
          const gap = group[i].xVal - group[i - 1].xVal
          if (gap < MIN_STEP) moveFamily(group[i - 1], MIN_STEP - gap)
        }
      }
    }
  }

  for (let iter = 0; iter < 5; iter++) {
    fixPairs()
    fixTiers()
  }
}

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

    if (shouldExcludeFromTree(rawSkill)) continue

    // Fix broken exports where a skill has the same name as its dependency.
    // In this case the skill is actually the next tier — rename "Foo I" → "Foo II".
    if (rawSkill.Dependency && toSkillId(rawSkill.SkillName) === toSkillId(rawSkill.Dependency)) {
      rawSkill.SkillName = rawSkill.SkillName.replace(/\bI\b$/, 'II')
      skill.skillName = rawSkill.SkillName
      skill.id = toSkillId(rawSkill.SkillName)
    }

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

  for (const tree of Object.values(trees)) resolveCollisions(tree.nodes)

  return trees
}
