export function sortAppsByFlag<
  T extends Record<K, boolean | undefined>,
  K extends keyof T
>(apps: T[], flagKey: K): T[] {
  return apps.sort((a, b) => {
    if (a[flagKey] && !b[flagKey]) return -1;
    if (!a[flagKey] && b[flagKey]) return 1;
    return 0;
  });
}
