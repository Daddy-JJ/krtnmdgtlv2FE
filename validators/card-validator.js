import { buildStarterInput, validateStarterInput } from './starter-validator.js';

export function buildCardInput(values, currentCard, locale = 'id') {
  const merged = {
    ...currentCard?.contact,
    ...values,
  };
  const input = buildStarterInput(merged, currentCard?.locale ?? locale);
  input.contact.mapsUrl = currentCard?.contact?.mapsUrl ?? null;
  return input;
}

export function validateCardInput(input, fields) {
  const errors = validateStarterInput(input);
  if (!fields) return errors;
  return Object.fromEntries(Object.entries(errors).filter(([field]) => fields.includes(field)));
}
