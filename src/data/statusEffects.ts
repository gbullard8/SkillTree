export const STATUS_EFFECTS: Record<string, string> = {
  'Bleeding':     'Target takes 1 physical damage for each hex they move. Reduces Physical Resistance by 4%.',
  'Blind':        'Skill range is reduced to 1 hex.',
  'Chilled':      'Movement points reduced by one per stack.\nLasts 2 turns. Five stacks of Chilled freezes the target.',
  'Crippled':     'Reduces Movement Points by 1 per stack.',
  'Disabled':     'Cannot perform actions.',
  'Exhaustion':   'Cannot receive additional action points.\n' +
                  'Caused by receiving additional action points this turn.',
  'Frozen':       'Cannot move or perform actions.',
  'Heat':         'Elemental resistance reduced by 5% per stack.\n' +
                  'Lasts 3 turns. Can stack up to 10 times.',
  'Immobilized':  'Cannot move.',
  // 'Life Steal':   'Heals you for a percentage of your Max Health each time you hit. Reduced for area of effect and no AP cost abilities.',
  'Marked Prey':  'Damage taken increased by 10% per stack.',
  'Poisoned':     'Target takes 2 shadow damage each turn. Reduces healing taken by 1%.',
  'Salvation':    'Maximum health increased by 10% per stack.',
  'Shocked':      'Incoming critical strike damage increased by 10% per stack. Lasts 3 turns. Can stack up to 10 times.',
  'Sleep':        'Cannot move or perform actions and damage taken increased by 50%. Can be awakened by getting attacked.',
  'Slow':         'Movement costs doubled.',
  'Stealth':      'Invisible. Attacking from Stealth has 100% critical hit chance.',
  'Stun':         'TODO',
  'Stunned':      'TODO',
};
