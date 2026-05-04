const assert = require('node:assert/strict');
const test = require('node:test');

const { requireWriteApiKey } = require('../middleware/write-auth');
const {
  validateProductPayload,
  validateCategoryPayload,
  validateTagPayload,
  validateIdParam,
} = require('../utils/validators');

function mockResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('write API key middleware rejects missing credentials', () => {
  process.env.WRITE_API_KEY = 'test-secret';
  const req = { get: () => undefined };
  const res = mockResponse();
  let nextCalled = false;

  requireWriteApiKey(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
});

test('write API key middleware allows matching x-api-key', () => {
  process.env.WRITE_API_KEY = 'test-secret';
  const req = { get: (name) => (name === 'x-api-key' ? 'test-secret' : undefined) };
  const res = mockResponse();
  let nextCalled = false;

  requireWriteApiKey(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
});

test('product validation allowlists and normalizes accepted fields', () => {
  const payload = validateProductPayload({
    product_name: 'Hat',
    price: '12.50',
    stock: '4',
    category_id: '2',
    id: 99,
    is_admin: true,
  });

  assert.deepEqual(payload, {
    product_name: 'Hat',
    price: 12.5,
    stock: 4,
    category_id: 2,
  });
});

test('product validation rejects invalid tag IDs', () => {
  assert.throws(
    () => validateProductPayload({ product_name: 'Hat', price: 12.5, stock: 4, tagIds: ['x'] }),
    /tagIds/
  );
});

test('category and tag validation reject extra fields', () => {
  assert.deepEqual(validateCategoryPayload({ category_name: 'Shoes', id: 5 }), {
    category_name: 'Shoes',
  });
  assert.deepEqual(validateTagPayload({ tag_name: 'Blue', product_id: 1 }), {
    tag_name: 'Blue',
  });
});

test('route id validation rejects non-integer IDs', () => {
  assert.throws(() => validateIdParam('abc'), /id/);
  assert.equal(validateIdParam('42'), 42);
});
