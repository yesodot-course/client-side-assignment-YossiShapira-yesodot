export function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}