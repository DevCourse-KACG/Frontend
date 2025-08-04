// YYYY-mm-dd 포맷
export function formatDateString(dateStr: string): string {
  return dateStr.split('T')[0];
}