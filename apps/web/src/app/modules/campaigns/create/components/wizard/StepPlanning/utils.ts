export function getCurrencySymbol(currency: string): string {
  switch (currency) {
    case 'EUR':
      return '€';
    case 'USD':
      return '$';
    case 'MGA':
      return 'Ar';
    default:
      return '€';
  }
}

export function formatCurrency(amount: number, currency: string): string {
  return `${amount} ${getCurrencySymbol(currency)}`;
}

export function calculateDuration(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateTotalBudget(
  budget: number,
  isDailyBudget: boolean,
  duration: number
): number {
  if (!isDailyBudget) return budget;
  return duration > 0 ? budget * duration : budget;
}
