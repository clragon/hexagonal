const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

type Bucket = [limit: number, seconds: number, unit: Intl.RelativeTimeFormatUnit];

const YEARS: Bucket = [Infinity, YEAR, "year"];

const UNITS: Bucket[] = [
  [MINUTE, 1, "second"],
  [HOUR, MINUTE, "minute"],
  [DAY, HOUR, "hour"],
  [WEEK, DAY, "day"],
  [MONTH, WEEK, "week"],
  [YEAR, MONTH, "month"],
  YEARS,
];

export function formatRelativeTime(value: Date, now: Date = new Date(), locale?: string): string {
  const seconds = (value.getTime() - now.getTime()) / 1000;
  const magnitude = Math.abs(seconds);
  const [, divisor, unit] = UNITS.find(([limit]) => magnitude < limit) ?? YEARS;
  const amount = Math.round(seconds / divisor);
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(amount, unit);
}

export function relativeTimeInterval(value: Date, now: Date = new Date()): number {
  const magnitude = Math.abs((value.getTime() - now.getTime()) / 1000);
  if (magnitude < MINUTE) return 1000 * 10;
  if (magnitude < HOUR) return 1000 * MINUTE;
  if (magnitude < DAY) return 1000 * HOUR;
  return 1000 * DAY;
}
