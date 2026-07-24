export function readCookie(name, cookieHeader = globalThis.document?.cookie ?? '') {
  const prefix = `${encodeURIComponent(name)}=`;
  const part = cookieHeader.split(';').map(value => value.trim()).find(value => value.startsWith(prefix));
  if (!part) return null;
  try { return decodeURIComponent(part.slice(prefix.length)); } catch { return null; }
}

export function csrfToken(context = 'access', cookieHeader) {
  return readCookie(context === 'starter' ? 'starter_csrf_token' : 'csrf_token', cookieHeader);
}
