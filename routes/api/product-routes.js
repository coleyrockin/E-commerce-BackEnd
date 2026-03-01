const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

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
    const product = await Product.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      include: [
        { model: Category, attributes: ['id', 'category_name'] },
        { model: Tag, attributes: ['id', 'tag_name'] },
      ],
    });
    if (!product) return res.status(404).json({ message: 'No product found with this id' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/products
// req.body: { product_name, price, stock, tagIds?: number[] }
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const tagIds = req.body.tagIds;
    if (tagIds && tagIds.length) {
      const productTagIdArr = tagIds.map((tag_id) => ({ product_id: product.id, tag_id }));
      const productTags = await ProductTag.bulkCreate(productTagIdArr);
      return res.status(201).json({ product, productTags });
    }
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'No product found with this id' });

    const tagIds = req.body.tagIds;
    if (tagIds) {
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      const newProductTags = tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => ({ product_id: req.params.id, tag_id }));

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'No product found with this id' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
