// Skills where Duration should display as "Special" instead of a number.
export const SPECIAL_DURATION_SKILLS = new Set<string>([

]);

// Skills where the JSON duration value is incorrect — hardcode the correct number here.
export const DURATION_OVERRIDE: Record<string, number> = {
  'ascendancy': 5,
  'gouge' : 3,
  "poisoned_dagger" : 3,
  'shadow_walk' : 1,
  'brambles' : 0,
  'chaos_crush' : 3,
  'poison_cloud' : 3,
  'bleeding_shot' : 3 
};

// Skills where the JSON AP cost value is incorrect — hardcode the correct number here (0 = None).
export const AP_COST_OVERRIDE: Record<string, number> = {
  'shield_of_light': 1,
};

// Skills that have multiple actions where the last one has the correct data.
export const USE_LAST_ACTION_SKILLS = new Set<string>([
  'nature_summoning_ii',
]);

// Skills where Range should display as "Special" instead of a number.
export const SPECIAL_RANGE_SKILLS = new Set<string>([
  'telekinesis',
  'cleave',
  'life_cleave',
  'bleeding_cleave'
]);

// Skills where Blast Radius should display as "Special" instead of a number.
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
