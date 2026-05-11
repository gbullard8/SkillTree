import { SkillNode } from '../models/SkillNode';
import { DAMAGE_VALUES, DamageValue } from '../data/damageValues';

// Fallback weapon ranges used when a skill only exposes a multiplier.
function getWeapon(node: SkillNode): { min: number; max: number } {
  if (node.skill.skillTags.includes(2)) return { min: 17, max: 22 };
  if (node.skill.skillTags.includes(4) && node.skill.skillType === 5) return { min: 14, max: 19 };
  return { min: 11, max: 15 };
}

function formatValue(v: DamageValue): string {
  const min = v.minDamage;
  const max = v.maxDamage;
  return min === max ? String(min) : `${min}-${max}`;
}

// Resolves displayed damage numbers from curated values or exported multipliers.
export function computeDamageValues(node: SkillNode): DamageValue[] | null {
  const damageValues = DAMAGE_VALUES[node.skill.id];
  if (damageValues && damageValues.some(v => v.minDamage !== 0 || v.maxDamage !== 0)) {
    return damageValues;
  }

  const multiplier = node.actions[0]?.damageEffects[0]?.damageMultiplier ?? null;
  if (multiplier !== null) {
    const weapon = getWeapon(node);
    return [{
      minDamage: Math.ceil(weapon.min * multiplier),
      maxDamage: Math.ceil(weapon.max * multiplier),
    }];
  }

  return null;
}

// Replaces exported damage placeholders with highlighted display ranges.
export function applyDamageRange(description: string, node: SkillNode): string {
  // The source file can include a runtime-only section that is not relevant here.
  description = description.replace(/\s*Current Bonus:[\s\S]*/, '');

  const values = computeDamageValues(node);
  if (!values) return description;

  let result = description;
  values.forEach((v, i) => {
    const display = formatValue(v);
    result = result
      .replace(new RegExp(`\\[${i}\\]`, 'g'), `{HL=${display}}`)
      .replace(new RegExp(`\\*${i}`, 'g'), `{HL=${display}}`);
  });

  return result;
}
