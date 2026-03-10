export function daysInProgram(startDate: Date, now: Date): number {
  return Math.max(
    0,
    Math.floor((now.getTime() - startDate.getTime()) / 86_400_000),
  );
}
