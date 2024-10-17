export function generateID(seed: number, length: number = 6): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;
  let hash = seed;
  let result = '';

  for (let i = 0; i < length; i++) {
    hash = (hash * 9301 + 49297) % 233280;
    const index = Math.abs(hash % charsLength);
    result += chars[index];
  }

  return result;
}
