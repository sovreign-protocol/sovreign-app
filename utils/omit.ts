export default function omit<
  T extends object,
  K extends Extract<keyof T, string>
>(obj: T, ...keys: K[]): Omit<T, K> {
  let ret: any = {};
  const excludeSet: Set<string> = new Set(keys);

  for (let key in obj) {
    if (!excludeSet.has(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
}
