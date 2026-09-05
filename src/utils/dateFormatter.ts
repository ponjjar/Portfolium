export function formatMonthYear(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  if (digits.length === 0) return '';
  
  // Format as MM/YYYY
  if (digits.length <= 2) {
    return digits;
  }
  
  return `${digits.substring(0, 2)}/${digits.substring(2, 6)}`;
}
