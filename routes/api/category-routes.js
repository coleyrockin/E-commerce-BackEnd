const router = require('express').Router();
const { Category, Product } = require('../../models');
const { requireWriteApiKey } = require('../../middleware/write-auth');
const { validateCategoryPayload, validateIdParam } = require('../../utils/validators');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'category_name'],
      include: [{ model: Product, attributes: ['id', 'product_name', 'price', 'stock', 'category_id'] }],
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/categories/:id
router.get('/:id', async (req, res) => {
  try {
    const id = validateIdParam(req.params.id);
    const category = await Category.findOne({
      where: { id },
      attributes: ['id', 'category_name'],
      include: [{ model: Product, attributes: ['id', 'product_name', 'price', 'stock', 'category_id'] }],
    });

    if (!category) return res.status(404).json({ message: 'No category found with this id' });
    return res.json(category);
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// POST /api/categories
router.post('/', requireWriteApiKey, async (req, res) => {
  try {
    const categoryPayload = validateCategoryPayload(req.body);
    const category = await Category.create(categoryPayload);
    return res.status(201).json(category);
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', requireWriteApiKey, async (req, res) => {
  try {
    const id = validateIdParam(req.params.id);
    const categoryPayload = validateCategoryPayload(req.body);
    const [updated] = await Category.update(categoryPayload, { where: { id } });

    if (!updated) return res.status(404).json({ message: 'No category found with this id' });
    return res.json({ message: 'Category updated' });
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', requireWriteApiKey, async (req, res) => {
  try {
    const id = validateIdParam(req.params.id);
    const deleted = await Category.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'No category found with this id' });
    return res.json({ message: 'Category deleted' });
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

module.exports = router;
