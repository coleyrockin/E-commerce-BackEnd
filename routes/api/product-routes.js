const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const { requireWriteApiKey } = require('../../middleware/write-auth');
const { validateIdParam, validateProductPayload, validateTagIds } = require('../../utils/validators');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      include: [
        { model: Category, attributes: ['id', 'category_name'] },
        { model: Tag, attributes: ['id', 'tag_name'] },
      ],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const id = validateIdParam(req.params.id);
    const product = await Product.findOne({
      where: { id },
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      include: [
        { model: Category, attributes: ['id', 'category_name'] },
        { model: Tag, attributes: ['id', 'tag_name'] },
      ],
    });

    if (!product) return res.status(404).json({ message: 'No product found with this id' });
    return res.json(product);
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// POST /api/products
// req.body: { product_name, price, stock?, category_id?, tagIds?: number[] }
router.post('/', requireWriteApiKey, async (req, res) => {
  try {
    const productPayload = validateProductPayload(req.body);
    const tagIds = validateTagIds(req.body);
    const product = await Product.create(productPayload);

    if (tagIds && tagIds.length) {
      const productTagIdArr = tagIds.map((tag_id) => ({ product_id: product.id, tag_id }));
      const productTags = await ProductTag.bulkCreate(productTagIdArr);
      return res.status(201).json({ product, productTags });
    }

    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', requireWriteApiKey, async (req, res) => {
  try {
    const id = validateIdParam(req.params.id);
    const productPayload = validateProductPayload(req.body, {
      requireProductName: false,
      requirePrice: false,
      allowEmpty: true,
    });
    const tagIds = validateTagIds(req.body);

    if (!tagIds && Object.keys(productPayload).length === 0) {
      return res.status(400).json({ message: 'Bad request', error: 'product payload must include an editable field or tagIds' });
    }

    if (Object.keys(productPayload).length) {
      const [updated] = await Product.update(productPayload, { where: { id } });
      if (!updated) return res.status(404).json({ message: 'No product found with this id' });
    }

    if (tagIds) {
      const productTags = await ProductTag.findAll({ where: { product_id: id } });
      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      const newProductTags = tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => ({ product_id: id, tag_id }));

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !tagIds.includes(tag_id))
        .map(({ id: productTagId }) => productTagId);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    return res.json({ message: 'Product updated' });
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', requireWriteApiKey, async (req, res) => {
  try {
    const id = validateIdParam(req.params.id);
    const deleted = await Product.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'No product found with this id' });
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

module.exports = router;
