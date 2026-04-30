const publicUrl = process.env.PUBLIC_URL ?? '';

export const assetUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${publicUrl}${normalizedPath}`;
};
