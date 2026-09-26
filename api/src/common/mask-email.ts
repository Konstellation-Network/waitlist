/** "alice@example.com" -> "al…@example.com" for logs. */
export function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at < 0) return '…';
  return `${email.slice(0, 2)}…${email.slice(at)}`;
}
