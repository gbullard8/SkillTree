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


## Updating Skill Data

1. Export Skill and/or Image data from Unity project. Currently saves locally, will update to export to develop github branch.
2. Replace `src/data/SkillData.json` with the new export to update skill data. Replace `public/icons` with the new exported icons folder.
3. Check `src/services/LoadSkillTrees.ts` for exclusions, dependency rename fixes, and layout mirroring.
4. Review `src/data/specialValues.ts` when AP cost, duration, range, or blast radius export values are incorrect and set overrides.
5. If skill deals damage or healing set the values in  `src/data/hardcodedDamage.ts`. Values were far too complex to export. 
6. Review `src/data/statusEffects.ts` for new status names.
7. Run `npm start` or `npm run build` and inspect each tree.


## Data Files

`src/data/SkillData.json`

Primary exported skill data. This is bundled at build time because it is imported from `src`. Keep it here unless the goal is to load/replace data at runtime without rebuilding.

`public/icons`

Skill icon files. The app expects each icon to match the normalized skill id, for example:

```text
Aura of Flame -> aura_of_flame.png
```


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


[React documentation](https://reactjs.org/).

