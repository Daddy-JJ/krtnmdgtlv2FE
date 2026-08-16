/** Accept a bare domain or URL and keep one canonical HTTPS representation. */
export function normalizeWebsiteUrl(value) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  // Preserve unsupported schemes so validation can reject them explicitly.
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(text) && !/^https?:\/\//i.test(text)) return text;
  return `https://${text.replace(/^(?:https?:\/\/)+/i, '')}`;
}

export function bindWebsiteUrlInput(input) {
  if (!input) return;
  const normalize = () => {
    const value = normalizeWebsiteUrl(input.value);
    if (input.value !== value) input.value = value;
  };
  input.addEventListener('blur', normalize);
  input.addEventListener('change', normalize);
  input.addEventListener('paste', () => queueMicrotask(normalize));
}
