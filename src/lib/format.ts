// Format a dollar amount: whole dollars show no decimals ($10),
// fractional amounts show two ($10.50).
export function formatPrice(price: number): string {
  const rounded = Math.round(price * 100) / 100;
  return Number.isInteger(rounded)
    ? `$${rounded}`
    : `$${rounded.toFixed(2)}`;
}
