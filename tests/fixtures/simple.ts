export function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0);
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export default function validateEmail(email: string): boolean {
  return email.includes('@');
}

function privateHelper(): void {
  // This should not be extracted
}

const internalVar = 42;
