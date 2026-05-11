const publicUrl = process.env.PUBLIC_URL ?? '';

// Maps skills whose exported id does not match the available icon asset.
const iconAliases: Record<string, string> = {
  pack_hunter_ii: 'pack_hunter_i',
};

export const assetUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${publicUrl}${normalizedPath}`;
};

export const skillIconUrl = (skillId: string) => {
  const resolvedSkillId = iconAliases[skillId] ?? skillId;
  return assetUrl(`/icons/${resolvedSkillId}.png`);
};
