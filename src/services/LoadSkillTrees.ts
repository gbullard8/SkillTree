import raw from '../data/SkillData.json'
import { TREE_ID_TO_NAME } from '../data/treeMap'
import { Skill } from '../models/Skill'
import { SkillNode, SkillTrees } from '../models/SkillNode'
import { Action } from '../models/Action'
import { USE_LAST_ACTION_SKILLS } from '../data/specialValues'

import { TREE_NODE_SIZE, TREE_X_STEP } from '../utils/treeCanvasLayout'

const MIN_GAP_PX = 8
// Minimum spacing between nodes, converted from pixels into xVal units.
const MIN_STEP = (TREE_NODE_SIZE + MIN_GAP_PX) / TREE_X_STEP

// These exports exist in the data file but should not render as tree nodes.
const SKILLS_EXCLUDED_FROM_TREE = new Set([
  '0:Fickle Flame',
  '5:Animal Companion Grizzly',
  '5:Beast Master I',
  '5:Beast Master II',
  '5:Summon Raven',
  '5:Summon Wolf',
  '10:Body and Soul',
])

// Filters out raw entries marked hidden or known companion/internal skills.
function shouldExcludeFromTree(rawSkill: any) {
  return rawSkill.DontIncludeInTree || SKILLS_EXCLUDED_FROM_TREE.has(`${rawSkill.SkillType}:${rawSkill.SkillName}`)
}

// Mutates xVal positions to spread nodes apart while preserving branch structure.
function resolveCollisions(nodes: SkillNode[]) {
  const byId = new Map(nodes.map(n => [n.id, n]))

  const childrenOf = new Map<string, SkillNode[]>()
  for (const n of nodes) {
    if (n.requires) {
      if (!childrenOf.has(n.requires)) childrenOf.set(n.requires, [])
      childrenOf.get(n.requires)!.push(n)
    }
  }

  // Positive delta moves active-side nodes outward; negative moves passive-side nodes outward.
  const shiftSubtree = (node: SkillNode, delta: number) => {
    node.xVal -= delta
    for (const child of (childrenOf.get(node.id) ?? [])) shiftSubtree(child, delta)
  }

  // Moves a branch family together so paired children stay centered.
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

  // Keeps paired upgrades from overlapping while anchoring the inner child.
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
        shiftSubtree(R, -delta)
      } else {
        shiftSubtree(L, delta)
      }
      if (parent) parent.xVal = (L.xVal + R.xVal) / 2
    }
  }

  // Group nodes by tier and side so active/passive lanes resolve separately.
  const tierGroups = new Map<string, SkillNode[]>()
  for (const n of nodes) {
    const key = `${n.tier}:${n.isPassive}`
    if (!tierGroups.has(key)) tierGroups.set(key, [])
    tierGroups.get(key)!.push(n)
  }

  // Resolves same-tier collisions from the center outward.
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

  // A few passes let pair and tier adjustments settle after moving branches.
  for (let iter = 0; iter < 5; iter++) {
    fixPairs()
    fixTiers()
  }
}

// Converts display names into stable ids used for dependencies and assets.
function toSkillId(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

// Converts exported JSON into grouped, positioned skill trees for rendering.
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
      isPassive: rawSkill.IsPassive,
    }

    if (shouldExcludeFromTree(rawSkill)) continue

    // Some exported upgrades reuse their dependency name; rename them to tier II.
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

    // Mirror active skills to the left and offset passive skills to the right.
    let xValBase = rawSkill.xVal
    if (skill.isPassive) {
      xValBase = xValBase + 5.5
    } else {
      xValBase = 6.0 - xValBase
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
