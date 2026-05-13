# Stolen Realm Skill Tree

Interactive skill tree calculator for Stolen Realm. The app is a Create React App/TypeScript project that reads exported skill data, builds the tree tabs, and lets users spend/refund talent points with the same tier and dependency rules used by the in-game trees.

## Running the App

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

## How the App Works

1. `src/features/skillTree/services/LoadSkillTrees.ts` imports `src/features/skillTree/data/SkillData.json`.
2. Each exported skill entry is converted into a local `SkillNode`.
3. `SkillType` is mapped to a tree name using `src/features/skillTree/data/treeMap.ts`.
4. `xVal`, `Tier`, `Dependency`, and `IsPassive` from the JSON decide where the node appears and what unlocks it.
5. `src/features/skillTree/SkillTreePage.tsx` provides the skill tree page entry point.
6. `src/features/skillTree/components/TalentTree.tsx` renders the selected tree, tabs, point counters, reset buttons, and level selector.
7. `src/features/skillTree/components/SkillNode.tsx` renders each node, while `src/features/skillTree/components/SkillTooltip.tsx` renders tooltip content.
8. Tooltip text is cleaned up by `src/features/skillTree/utils/computeDamageRange.ts` and `src/features/skillTree/utils/parseDescription.tsx`.
9. Point spending rules are handled by `src/features/skillTree/utils/canUnlock.ts` and stored in `src/features/skillTree/context/TalentTreeContext.tsx`.


## Updating Skill Data

1. Export skill and/or image data from the Unity project. The export currently saves locally, but will be updated to export to the develop GitHub branch.
2. Replace `src/features/skillTree/data/SkillData.json` with the new export to update skill data. Replace `public/icons` with the newly exported icons folder.
3. Check `src/features/skillTree/services/LoadSkillTrees.ts` for exclusions, dependency rename fixes, and layout mirroring.
4. Review `src/features/skillTree/data/specialValues.ts` when exported AP cost, duration, range, or blast radius values are incorrect, and set overrides.
5. If a skill deals damage or healing, set the values in `src/features/skillTree/data/damageValues.ts`. These values were too complex to export cleanly.
6. Review `src/features/skillTree/data/statusEffects.ts` for new status names.
7. Run `npm start` or `npm run build` and inspect each tree.


## Data Files

`src/features/skillTree/data/SkillData.json`

Primary exported skill data. This is bundled at build time because it is imported from `src`. 

`public/icons`

Skill icon files. The app expects each icon to match the normalized skill id, for example:

```text
Aura of Flame -> aura_of_flame.png
```

## Asset Locations

`src/assets/talentbackground`

Bundled talent tree UI assets referenced by CSS, such as frames, overlays, borders, and the main background.

`src/features/skillTree`

Skill-tree feature code. This keeps the calculator's components, context, models, data, services, and rule utilities together so new site areas can live beside it, such as `src/features/items`.

`public/icons`

Runtime skill icons loaded by normalized skill id.

`public/tabs`

Runtime tab icons. The Ranger tab currently uses `public/tabs/Ranger.PNG`.

`public/talentbackground`

Fallback/loading assets used by `public/index.html`, root `index.html`, and runtime public URLs.


### Visible Tabs and Tab Icons

Files:

```text
src/features/skillTree/components/TalentTree.tsx
src/features/skillTree/components/TabSelector.tsx
```

The visible tab order and tab icon image for each tree are set manually in both files:

```text
Fire, Lightning, Cold, Warrior, Light, Ranger, Shadow, Thief, Monk, Nature, Chaos
```

If a tab is added, removed, renamed, or its icon changes, update both places.



### Layout Numbers

File: `src/features/skillTree/utils/treeCanvasLayout.ts`

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

File: `src/features/skillTree/services/LoadSkillTrees.ts`

Active and passive nodes are mirrored manually from exported `xVal`

That same loader also performs collision cleanup for crowded sibling/tier layouts.


### Tooltip Stat Overrides

File: `src/features/skillTree/data/specialValues.ts`

Override imported values here.

A few skills have more complex settings that cannot be reasonably exported.

### Damage Value Settings

File: `src/features/skillTree/data/damageValues.ts`

Set damage and healing values here for skills that deal damage or healing.

Generating these values requires initializing several game systems, so setting them manually is more efficient.
