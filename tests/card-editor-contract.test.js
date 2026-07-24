import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiClient } from '../services/api-client.js';
import { buildCardInput, validateCardInput } from '../validators/card-validator.js';

test('card update uses access CSRF and preserves a complete contact payload', async () => {
  let observed;
  const client = new ApiClient({
    baseUrl: 'https://example.test/api/v1',
    cookieSource: () => 'csrf_token=access-csrf; starter_csrf_token=starter-csrf',
    fetchImpl: async (_url, options) => {
      observed = {
        csrf: options.headers.get('x-csrf-token'),
        body: JSON.parse(options.body),
      };
      return new Response(JSON.stringify({ success: true, data: { publicId: 'card-1' } }), { status: 200 });
    },
  });
  const currentCard = {
    publicId: 'card-1',
    locale: 'id',
    contact: {
      fullName: 'Nama Lama',
      jobTitle: 'Owner',
      organization: 'KND',
      officePhone: '021',
      mobilePhone: '08123',
      email: 'old@example.com',
      websiteUrl: 'https://old.example',
      addressText: 'Jakarta',
      mapsUrl: null,
    },
  };

  const input = buildCardInput({ fullName: 'Nama Baru' }, currentCard);
  await client.put('/cards/card-1', input, { csrfContext: 'access' });

  assert.equal(observed.csrf, 'access-csrf');
  assert.equal(observed.body.contact.fullName, 'Nama Baru');
  assert.equal(observed.body.contact.email, 'old@example.com');
  assert.equal(observed.body.contact.mapsUrl, null);
});

test('card editor validator can scope field errors to the active page section', () => {
  const currentCard = {
    locale: 'id',
    contact: {
      fullName: 'Nama',
      jobTitle: '',
      organization: '',
      officePhone: '',
      mobilePhone: '',
      email: 'bad',
      websiteUrl: 'ftp://bad.test',
      addressText: '',
      mapsUrl: null,
    },
  };
  const input = buildCardInput({}, currentCard);

  assert.deepEqual(validateCardInput(input, ['fullName', 'jobTitle', 'organization']), {});
  assert.equal(validateCardInput(input, ['email', 'websiteUrl']).email, 'Format email belum valid.');
});
