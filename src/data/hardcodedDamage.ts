export type HardcodedValue = { minDamage: number; maxDamage: number };

// Single value: [{ min, max }]
// Multiple values: [{ min, max }, { min, max }] — maps to *0/[0], *1/[1] in order
export type HardcodedDamage = HardcodedValue[];

// Skills whose damage/healing values are too complex to export automatically.
// Sorted by tree → tier → alphabetical.
export const HARDCODED_DAMAGE: Record<string, HardcodedDamage> = {

  // ── Chaos ────────────────────────────────────────────────────────────────
  // Tier 1
  // Each element has a 50% chance to deal *0 damage every turn.
  'chaos_curse':          [{ minDamage: 6, maxDamage: 8 }],

  // Tier 5
  // Deals between *0 and *1 damage within 2 hexes. (*0 = min, *1 = max)
  'chaos_crush':          [{ minDamage: 13, maxDamage: 18 }, { minDamage: 65, maxDamage: 87 }],
  // Clone explodes on death, each element has a 50% chance to deal *0 damage.
  'replicate':            [{ minDamage: 7, maxDamage: 7 }],

  // ── Cold ─────────────────────────────────────────────────────────────────
  // Tier 1
  // Attackers take *0 cold damage.
  'frost_armor':          [{ minDamage: 2, maxDamage: 3 }],

  // Tier 4
  // Deals [0] cold damage each time the target performs an action.
  'brain_freeze':         [{ minDamage: 13, maxDamage: 13 }],
  // Conjures a massive ice storm dealing *0 cold damage each turn.
  'ice_storm':            [{ minDamage: 10, maxDamage: 14 }],
  // Intelligence grants [0] Armor and Magic Armor per point.
  'invulnerable_winter':  [{ minDamage: 1.1, maxDamage: 1.1 }],
  // Grants [0] Armor and Magic Armor for the duration.
  'stasis':               [{ minDamage: 15, maxDamage: 15 }],

  // ── Fire ─────────────────────────────────────────────────────────────────
  // Tier 1
  // Attackers take *0 fire damage.
  'fire_shield':          [{ minDamage: 2, maxDamage: 3 }],
  // Burns the target for *0 fire damage each turn.
  'immolate':             [{ minDamage: 6, maxDamage: 8 }],

  // Tier 2
  // Enemies take *0 fire damage each turn on burning ground.
  'burning_ground':       [{ minDamage: 6, maxDamage: 8 }],
  'enchant_fire':         [{ minDamage: 3, maxDamage: 3 }],

  // Tier 3
  // Continually deals *0 fire damage to enemies within 3 hexes.
  'aura_of_flame':        [{ minDamage: 5, maxDamage: 6 }],
  // Detonates dealing [0] fire damage to all enemies within 1 hex.
  'rune_of_exploding':    [{ minDamage: 21, maxDamage: 29 }],

  // Tier 5
  // Each stack of Heat now applies [0] fire damage to the target per turn.
  'avatar_of_flame':      [{ minDamage: 3, maxDamage: 3 }],
  'meteor_shower':        [{minDamage: 8, maxDamage: 13}],

  // ── Light ────────────────────────────────────────────────────────────────
  // Tier 1
  // Target restores *0 health per turn.
  'regenerate':           [{ minDamage: 6, maxDamage: 8 }],

  // Tier 4
  // Heals *0 per turn for 3 turns.
  'holy_ground':          [{ minDamage: 9, maxDamage: 11 }],

  // Tier 5
  // All allies within 3 hexes heal for *0 per turn.
  'seal_of_salvation':    [{ minDamage: 11, maxDamage: 15 }],

  // ── Lightning ────────────────────────────────────────────────────────────
  // Tier 1
  // Attackers take *0 lightning damage.
  'lightning_shield':     [{ minDamage: 2, maxDamage: 3 }],

  // Tier 3
  // Enemies within aura suffer *0 lightning damage per action.
  'aura_of_lightning':    [{ minDamage: 5, maxDamage: 6 }],

  // Tier 4
  // Deals *0 lightning damage every turn to enemies within range.
  'thunder_storm':        [{ minDamage: 12, maxDamage: 12 }],

  // ── Monk ─────────────────────────────────────────────────────────────────
  // Tier 5
  // Increases all attributes by [0].
  'perfected_soul':       [{ minDamage: 1, maxDamage: 1 }],

  // ── Nature ───────────────────────────────────────────────────────────────
  // Tier 1
  // Deals *0 physical damage and applies Bleeding each turn.
  'faerie_swarm':         [{ minDamage: 5, maxDamage: 6 }],
  // Grants [0] Return Physical Damage.
  'thorns_i':             [{ minDamage: 1.2, maxDamage: 1.2 }],

  // Tier 2
  // Increases armor and magic armor by [0], regenerates *0 health per turn. ([0] = armor, *0 = health)
  'living_armor':         [{ minDamage: 4, maxDamage: 4 }, { minDamage: 7, maxDamage: 7 }],
  // Grants an additional [0] Return Physical Damage.
  'thorns_ii':            [{ minDamage: 1.8, maxDamage: 1.8 }],

  // Tier 3
  // Regenerates [0] health and mana per turn.
  'the_good_bloom':       [{ minDamage: 4, maxDamage: 6 }],

  // Tier 5
  // Gain the ability to shapeshift into Dragonkin. Increases Armor by [0].
  'shapeshift_dragonkin': [{ minDamage: 9, maxDamage: 12 }],
  // Increases Max Health and Damage of allies by [0]%.
  'titan_bloom':          [{ minDamage: 15, maxDamage: 15 }],

  // ── Ranger ───────────────────────────────────────────────────────────────
  // Tier 1
  // Physical damage increased by [0].
  'huntsman_i':           [{ minDamage: 1.2, maxDamage: 1.2 }],

  // Tier 2
  // Physical damage increased by [0].
  'huntsman_ii':          [{ minDamage: 1.8, maxDamage: 1.8 }],

  // ── Shadow ───────────────────────────────────────────────────────────────
  // Tier 2
  // Deals *0 shadow damage every turn for 3 turns.
  'haunt':                [{ minDamage: 6, maxDamage: 8 }],
  // Grants [0] Return Shadow Damage.
  'vengeful_shadows':     [{ minDamage: 3, maxDamage: 3 }],

  // Tier 4
  // Damage steals [0] points of Dexterity.
  'leech_dexterity':      [{ minDamage: 0.2, maxDamage: 0.2 }],
  // Damage steals [0] points of Intelligence.
  'leech_intelligence':   [{ minDamage: 0.2, maxDamage: 0.2 }],
  // Damage steals [0] points of Might.
  'leech_might':          [{ minDamage: 0.2, maxDamage: 0.2 }],


  // ── Chaos ────────────────────────────────────────────────────────────────
  // Tier 1
  'chaos_crash':            [{ minDamage: 9, maxDamage: 12 }],
  // Tier 2
  'chaos_cut':              [{ minDamage: 8, maxDamage: 10 }],
  // Tier 3
  'chaos_cloud':            [{ minDamage: 4, maxDamage: 5 }],

  // ── Cold ─────────────────────────────────────────────────────────────────
  // Tier 1
  'chilling_strike':        [{ minDamage: 17, maxDamage: 22 }],
  'frost_shard':            [{ minDamage: 14, maxDamage: 19 }],
  // Tier 2
  'enchant_cold':           [{ minDamage: 3, maxDamage: 3 }],
  'frost_nova':             [{ minDamage: 11, maxDamage: 15 }],
  'frozen_orb':             [{ minDamage: 0, maxDamage: 0 }],
  'ice_lance':              [{ minDamage: 13, maxDamage: 18 }],
  // Tier 3
  'breath_of_winter':       [{ minDamage: 18, maxDamage: 24 }],
  'frozen_spikes':          [{ minDamage: 3, maxDamage: 3 }],
  // Tier 5
  'chain_frost':            [{ minDamage: 6, maxDamage: 8 }],
  'shatter':                [{ minDamage: 8, maxDamage: 11 }],

  // ── Fire ─────────────────────────────────────────────────────────────────
  // Tier 1
  'fireblast':              [{ minDamage: 17, maxDamage: 22 }],
  // Tier 2
  'fireball':               [{ minDamage: 12, maxDamage: 16 }],
  'sun_fire':               [{ minDamage: 0, maxDamage: 0 }],
  // Tier 3
  'detonate':               [{ minDamage: 18, maxDamage: 24 }],
  // Tier 4 — meteor: *0 impact damage, *1 per-turn fire damage
  'fissure':                [{ minDamage: 22, maxDamage: 29 }],
  'meteor':                 [{ minDamage: 11, maxDamage: 15 }, { minDamage: 7, maxDamage: 9 }],
  // Tier 5
  'fire_storm':             [{ minDamage: 12, maxDamage: 16 }],

  // ── Light ────────────────────────────────────────────────────────────────
  // Tier 1
  'breath_of_life':         [{ minDamage: 0, maxDamage: 0 }],
  'cure':                   [{ minDamage: 17, maxDamage: 22 }],
  // Tier 2 — shield_of_retribution: *0 absorb, *0 explosion (same value)
  'blinding_light':         [{ minDamage: 9, maxDamage: 12 }],
  'celestial_light':        [{ minDamage: 0, maxDamage: 0 }],
  'shield_of_light':        [{ minDamage: 14, maxDamage: 19 }],
  // Tier 3
  'mass_cure':              [{ minDamage: 20, maxDamage: 27 }],
  // Tier 4 — shield_of_retribution: *0 absorb + *0 explosion
  'lingering_light':        [{ minDamage: 5, maxDamage: 6 }],
  'shield_of_retribution':  [{ minDamage: 26, maxDamage: 26 }, { minDamage: 26, maxDamage: 26 }],

  // ── Lightning ────────────────────────────────────────────────────────────
  // Tier 1
  'dazzling_darts':         [{ minDamage: 5, maxDamage: 6 }],
  'lightning_breath':       [{ minDamage: 0, maxDamage: 0 }],
  'shock':                  [{ minDamage: 7, maxDamage: 9 }],
  // Tier 2
  'discharge':              [{ minDamage: 10, maxDamage: 14 }],
  'enchant_lightning':      [{ minDamage: 3, maxDamage: 3 }],
  'twister':                [{ minDamage: 13, maxDamage: 18 }],
  // Tier 3
  'chain_lightning':        [{ minDamage: 9, maxDamage: 12 }],
  'thunder_bolt':           [{ minDamage: 12, maxDamage: 16 }],
  // Tier 4
  'shocking_shackles':      [{ minDamage: 26, maxDamage: 26 }],
  // Tier 5
  'energy_cannon':          [{ minDamage: 3, maxDamage: 3 }],
  'thunder_struck':         [{ minDamage: 12, maxDamage: 16 }],
  'thunder_wrath':          [{ minDamage: 13, maxDamage: 13 }],

  // ── Monk ─────────────────────────────────────────────────────────────────
  // Tier 1
  'chi_strike':             [{ minDamage: 22, maxDamage: 29 }],
  'front_kick':             [{ minDamage: 27, maxDamage: 36 }],
  // Tier 2
  'focused_strike':         [{ minDamage: 25, maxDamage: 34 }],
  'force_kick':             [{ minDamage: 31, maxDamage: 41 }],
  'paralyzing_strike':      [{ minDamage: 25, maxDamage: 34 }],
  'stunning_kick':          [{ minDamage: 27, maxDamage: 36 }],
  // Tier 3
  'dashing_strikes':        [{ minDamage: 27, maxDamage: 36 }],
  'falcon_dash':            [{ minDamage: 15, maxDamage: 20 }],
  'sweeping_kick':          [{ minDamage: 29, maxDamage: 39 }],
  // Tier 4
  'cyclone_kick':           [{ minDamage: 29, maxDamage: 39 }],
  'dodging_strikes':        [{ minDamage: 32, maxDamage: 44 }],
  'power_strikes':          [{ minDamage: 32, maxDamage: 44 }],
  // Tier 5
  'many_sided_strike':      [{ minDamage: 18, maxDamage: 24 }],
  'quaking_fist':           [{ minDamage: 45, maxDamage: 60 }],

  // ── Nature ───────────────────────────────────────────────────────────────
  // Tier 1
  'entangle':               [{ minDamage: 3, maxDamage: 4 }],
  // Tier 4
  'mass_entangle':          [{ minDamage: 6, maxDamage: 9 }],

  // ── Ranger ───────────────────────────────────────────────────────────────
  // Tier 1
  'crippling_shot':         [{ minDamage: 11, maxDamage: 14 }],
  // Tier 2
  'bleeding_shot':          [{ minDamage: 12, maxDamage: 16 }],
  'pinning_shot':           [{ minDamage: 12, maxDamage: 16 }],
  // Tier 3
  'blasting_shot':          [{ minDamage: 15, maxDamage: 20 }],
  'long_shot':              [{ minDamage: 15, maxDamage: 20 }],
  'volley':                 [{ minDamage: 24, maxDamage: 32 }],
  // Tier 4
  'called_shot':            [{ minDamage: 15, maxDamage: 20 }],
  'dispelling_shot':        [{ minDamage: 15, maxDamage: 20 }],
  'piercing_shot':          [{ minDamage: 29, maxDamage: 40 }],
  'sniper_shot':            [{ minDamage: 15, maxDamage: 20 }],
  // Tier 5 — force_shot: *0 main hit, [1] secondary
  'branching_shot':         [{ minDamage: 29, maxDamage: 40 }],
  'force_shot':             [{ minDamage: 44, maxDamage: 59 }, { minDamage: 43, maxDamage: 49 }],
  'slaying_shot':           [{ minDamage: 58, maxDamage: 79 }],

  // ── Shadow ───────────────────────────────────────────────────────────────
  // Tier 1
  'blind':                  [{ minDamage: 12, maxDamage: 16 }],
  'shadow_breath':          [{ minDamage: 0, maxDamage: 0 }],
  'tainted_touch':          [{ minDamage: 13, maxDamage: 18 }],
  // Tier 2
  'abyssal_night':          [{ minDamage: 0, maxDamage: 0 }],
  'spectral_chains':        [{ minDamage: 8, maxDamage: 11 }],
  // Tier 3
  'consumption':            [{ minDamage: 7, maxDamage: 10 }],
  'soul_crush':             [{ minDamage: 21, maxDamage: 28 }],
  // Tier 4
  'exorcism':               [{ minDamage: 11, maxDamage: 15 }],
  // Tier 5
  'reapers_scythe':         [{ minDamage: 11, maxDamage: 15 }],
  'soul_exchange':          [{ minDamage: 11, maxDamage: 15 }],

  // ── Thief ────────────────────────────────────────────────────────────────
  // Tier 1
  'cripple':                [{ minDamage: 13, maxDamage: 17 }],
  'dagger_throw':           [{ minDamage: 13, maxDamage: 17 }],
  // Tier 2
  'deadly_dagger':          [{ minDamage: 15, maxDamage: 20 }],
  'gouge':                  [{ minDamage: 15, maxDamage: 20 }],
  'maim':                   [{ minDamage: 15, maxDamage: 20 }],
  'poisoned_dagger':        [{ minDamage: 15, maxDamage: 20 }],
  // Tier 3
  'garrote':                [{ minDamage: 18, maxDamage: 24 }],
  // Tier 4
  'gore':                   [{ minDamage: 29, maxDamage: 39 }],
  'rupture':                [{ minDamage: 18, maxDamage: 24 }],
  // Tier 5 — uses *1
  'deathblow':              [{ minDamage: 36, maxDamage: 48 }],

  // ── Warrior ──────────────────────────────────────────────────────────────
  // Tier 1
  'bash':                   [{ minDamage: 22, maxDamage: 29 }],
  'double_edge':            [{ minDamage: 32, maxDamage: 44 }],
  'fracture':               [{ minDamage: 13, maxDamage: 17 }],
  // Tier 2
  'charge':                 [{ minDamage: 18, maxDamage: 24 }],
  'cleave':                 [{ minDamage: 27, maxDamage: 36 }],
  'dispelling_fracture':    [{ minDamage: 15, maxDamage: 20 }],
  'mortal_fracture':        [{ minDamage: 15, maxDamage: 20 }],
  // Tier 3
  'bleeding_cleave':        [{ minDamage: 18, maxDamage: 24 }],
  'howl':                   [{ minDamage: 13, maxDamage: 17 }],
  'life_cleave':            [{ minDamage: 27, maxDamage: 36 }],
  'slam':                   [{ minDamage: 29, maxDamage: 39 }],
  // Tier 4
  'crushing_slam':          [{ minDamage: 43, maxDamage: 58 }],
  'stunning_slam':          [{ minDamage: 32, maxDamage: 44 }],
  'vitality_break':         [{ minDamage: 47, maxDamage: 64 }],
  // Tier 5
  'sunder':                 [{ minDamage: 36, maxDamage: 48 }],
};
