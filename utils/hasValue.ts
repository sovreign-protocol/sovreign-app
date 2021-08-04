export default function hasValue(value: string) {
  return value !== undefined && value !== null && value.trim() !== "";
}
