export function formatDateDDMMYYYY(iso: string): string {
  // iso is guaranteed YYYY-MM-DD by validation
  const [year, month, day] = iso.split("-");
  return `${day}-${month}-${year}`;
}
