# Stolen Realm Skill Tree

Interactive skill tree calculator for Stolen Realm. The app is a Create React App/TypeScript project that reads exported skill data, builds the tree tabs, and lets users spend/refund talent points with the same tier and dependency rules used by the in-game trees.

## Running The App

```bash
npm start
```

Build for GitHub Pages/static hosting:

```bash
npm run build
```

The configured homepage is:

```text
https://gbullard8.github.io/SkillTree
```

## How The App Works

1. `src/services/LoadSkillTrees.ts` imports `src/data/SkillData.json`.
2. Each exported skill entry is converted into a local `SkillNode`.
3. `SkillType` is mapped to a tree name using `src/data/treeMap.ts`.
4. `xVal`, `Tier`, `Dependency`, and `IsPassive` from the JSON decide where the node appears and what unlocks it.
5. `src/components/TalentTree.tsx` renders the selected tree, tabs, point counters, reset buttons, and level selector.
6. `src/components/SkillNode.tsx` renders each node and its tooltip.
7. Tooltip text is cleaned up by `src/utils/computeDamageRange.ts` and `src/utils/parseDescription.tsx`.
8. Point spending rules are handled by `src/utils/CanUnlock.ts` and stored in `src/context/TalentTreeContext.tsx`.

## Data Files

`src/data/SkillData.json`

Primary exported skill data. This is bundled at build time because it is imported from `src`. Keep it here unless the goal is to load/replace data at runtime without rebuilding.

`public/icons`

Skill icon files. The app expects each icon to match the normalized skill id, for example:

```text
Aura of Flame -> aura_of_flame.png
```

If a skill icon is missing and the skill has a dependency, the node tries to fall back to the dependency icon.

`public/talentbackground`

Runtime background and frame assets used by the UI.

`src/assets`

Source-side copies of several image assets. The running UI mostly references the copies in `public` through `assetUrl`.

### Tree Names

File: `src/data/treeMap.ts`

Maps numeric `SkillType` IDs from `SkillData.json` to display tree names

### Visible Tabs And Tab Icons

Files:

```text
src/components/TalentTree.tsx
src/components/TabSelector.tsx
```

The visible tab order and tab icon image for each tree are set manually in both files:

```text
Fire, Lightning, Cold, Warrior, Light, Ranger, Shadow, Thief, Monk, Nature, Chaos
```

If a tab is added, removed, renamed, or its icon changes, update both places.

### Skill Exclusions

File: `src/services/LoadSkillTrees.ts`

Some skills are manually excluded from the rendered tree:

```text
0:Fickle Flame
5:Animal Companion Grizzly
5:Beast Master I
5:Beast Master II
5:Summon Raven
5:Summon Wolf
10:Body and Soul
```

Skills are also excluded when the raw JSON has `DontIncludeInTree`.

### Layout Numbers

File: `src/utils/treeCanvasLayout.ts`

Tree layout is controlled by manual canvas constants:

```text
TREE_CANVAS_WIDTH
TREE_CANVAS_HEIGHT
TREE_NODE_SIZE
TREE_CENTER_XVAL
TREE_X_STEP
TREE_TOP_OFFSET
TREE_TIER_STEP
```

File: `src/services/LoadSkillTrees.ts`

Active and passive nodes are mirrored manually from exported `xVal`

That same loader also performs collision cleanup for crowded sibling/tier layouts.


### Tooltip Stat Overrides

File: `src/data/specialValues.ts`

Manual tooltip display fixes live here

### Hardcoded Damage And Healing Values

File: `src/data/hardcodedDamage.ts`

Damage values cannot be exported from the project without unreasonable effort. Set damage values here by skill.

## Updating Skill Data

1. Replace `src/data/SkillData.json` with the new export.
2. Confirm new/renamed skills have matching icon files in `public/icons`.
3. Check `src/data/treeMap.ts` if any `SkillType` values changed.
4. Check `src/services/LoadSkillTrees.ts` for exclusions, dependency rename fixes, and layout mirroring.
5. Review `src/data/specialValues.ts` for incorrect AP cost, duration, range, or blast radius values.
6. Review `src/data/hardcodedDamage.ts` for skills with unresolved `*0`, `*1`, `[0]`, or `[1]` placeholders.
7. Review `src/data/statusEffects.ts` for new status names.
8. Run `npm start` or `npm run build` and inspect each tree.


[React documentation](https://reactjs.org/).
# SkillTree
