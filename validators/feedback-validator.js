export function validateFeedback(input) {
  const message = String(input?.message ?? '').trim();
  const errors = {};
  if (!message) errors.message = 'Feedback wajib diisi.';
  else if ([...message].length > 300) errors.message = 'Feedback maksimal 300 karakter.';
  return { valid: Object.keys(errors).length === 0, errors, value: { message } };
}
