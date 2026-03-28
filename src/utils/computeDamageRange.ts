import { SkillNode } from '../models/SkillNode';
import { HARDCODED_DAMAGE, HardcodedValue } from '../data/hardcodedDamage';

function getWeapon(node: SkillNode): { min: number; max: number } {
  if (node.skill.skillTags.includes(2)) return { min: 17, max: 22 };
  if (node.skill.skillTags.includes(4) && node.skill.skillType === 5) return { min: 14, max: 19 };
  return { min: 11, max: 15 };
}

function formatValue(v: HardcodedValue): string {
  const min = v.minDamage;
  const max = v.maxDamage;
  return min === max ? String(min) : `${min}-${max}`;
}

export function computeDamageValues(node: SkillNode): HardcodedValue[] | null {
  const hardcoded = HARDCODED_DAMAGE[node.skill.id];
  if (hardcoded && hardcoded.some(v => v.minDamage !== 0 || v.maxDamage !== 0)) {
    return hardcoded;
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

export function applyDamageRange(description: string, node: SkillNode): string {
  description = description.replace(/\s*Current Bonus:[\s\S]*/, '');

  const values = computeDamageValues(node);
  if (!values) return description;

  let result = description;
  values.forEach((v, i) => {
    const display = formatValue(v);
    result = result
      .replace(new RegExp(`\\[${i}\\]`, 'g'), display)
      .replace(new RegExp(`\\*${i}`, 'g'), display);
  });

  return result;
}
