// PeerPath only trusts @mail.utoronto.ca addresses. This check runs both in
// the browser (for instant feedback) and on the server (so it can't be
// bypassed by skipping the form).

const ALLOWED_DOMAIN = "mail.utoronto.ca";

export function isUofTEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith(`@${ALLOWED_DOMAIN}`);
}
