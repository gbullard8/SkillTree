// Corrects duration values from the JSON export; 0 hides duration.
export const DURATION_OVERRIDE: Record<string, number> = {
  'ascendancy': 5,
  'gouge': 3,
  'poisoned_dagger': 3,
  'shadow_walk': 1,
  'brambles': 0,
  'chaos_crush': 3,
  'poison_cloud': 3,
  'bleeding_shot': 3,
};

// Corrects AP cost values from the JSON export; 0 displays "None".
export const AP_COST_OVERRIDE: Record<string, number> = {
  'shield_of_light': 1,
};

// Uses the last action when earlier exported actions contain setup data.
export const USE_LAST_ACTION_SKILLS = new Set<string>([
  'nature_summoning_ii',
]);

// Displays "Special" instead of a numeric range.
export const SPECIAL_RANGE_SKILLS = new Set<string>([
  'telekinesis',
  'cleave',
  'life_cleave',
  'bleeding_cleave'
]);

// Displays "Special" instead of a numeric blast radius.
export const SPECIAL_BLAST_RADIUS_SKILLS = new Set<string>([
  'chaos_cut',
  'fissure',
  'energy_cannon',
  'twister',
  'ice_lance',
  'cleave',
  'life_cleave',
  'bleeding_cleave',
  'slam',
  'stunning_slam',
  'crushing_slam',
  'piercing_shot',
  'force_shot',
  'falcon_dash',
]);
