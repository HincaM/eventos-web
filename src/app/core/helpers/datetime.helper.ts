export function toApiDateTime(localDateTimeValue: string): string {
  return new Date(localDateTimeValue).toISOString();
}

export function nowAsDatetimeLocalValue(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}
