const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function money(value: number | null | undefined): string {
  return currency.format(Number(value ?? 0));
}

export function shortDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "—" : date.format(parsed);
}

export function percent(rate: number | null | undefined): string {
  return `${Math.round(Number(rate ?? 0) * 1000) / 10}%`;
}
