function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function toPositiveInteger(value, fieldName) {
  const number = Number(value);

  if (!Number.isInteger(number) || number <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  return number;
}

function validateIdParam(value) {
  return toPositiveInteger(value, 'id');
}

function validateNonEmptyString(value, fieldName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  return value.trim();
}

function validateDecimal(value, fieldName) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${fieldName} must be a non-negative number`);
  }

  return number;
}

function validateNonNegativeInteger(value, fieldName) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }

  return number;
}

function validateTagIds(body) {
  if (!Object.prototype.hasOwnProperty.call(body, 'tagIds')) {
    return undefined;
  }

  if (!Array.isArray(body.tagIds)) {
    throw new Error('tagIds must be an array');
  }

  return body.tagIds.map((tagId) => toPositiveInteger(tagId, 'tagIds'));
}

function validateProductPayload(body, options = {}) {
  if (!isPlainObject(body)) {
    throw new Error('body must be an object');
  }

  validateTagIds(body);

  const payload = {};
  const requireProductName = options.requireProductName !== false;
  const requirePrice = options.requirePrice !== false;

  if (Object.prototype.hasOwnProperty.call(body, 'product_name')) {
    payload.product_name = validateNonEmptyString(body.product_name, 'product_name');
  } else if (requireProductName) {
    throw new Error('product_name is required');
  }

  if (Object.prototype.hasOwnProperty.call(body, 'price')) {
    payload.price = validateDecimal(body.price, 'price');
  } else if (requirePrice) {
    throw new Error('price is required');
  }

  if (Object.prototype.hasOwnProperty.call(body, 'stock')) {
    payload.stock = validateNonNegativeInteger(body.stock, 'stock');
  }

  if (Object.prototype.hasOwnProperty.call(body, 'category_id')) {
    payload.category_id = toPositiveInteger(body.category_id, 'category_id');
  }

  if (Object.keys(payload).length === 0 && !options.allowEmpty) {
    throw new Error('product payload must include at least one editable field');
  }

  return payload;
}

function validateCategoryPayload(body) {
  if (!isPlainObject(body)) {
    throw new Error('body must be an object');
  }

  return {
    category_name: validateNonEmptyString(body.category_name, 'category_name'),
  };
}

function validateTagPayload(body) {
  if (!isPlainObject(body)) {
    throw new Error('body must be an object');
  }

  return {
    tag_name: validateNonEmptyString(body.tag_name, 'tag_name'),
  };
}

module.exports = {
  validateProductPayload,
  validateCategoryPayload,
  validateTagPayload,
  validateIdParam,
  validateTagIds,
};
