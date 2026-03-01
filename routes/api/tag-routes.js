const router = require('express').Router();
const { Tag, Product } = require('../../models');

// GET /api/tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      attributes: ['id', 'tag_name'],
      include: [{ model: Product, attributes: ['id', 'product_name', 'price', 'stock', 'category_id'] }],
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/tags/:id
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'tag_name'],
      include: [{ model: Product, attributes: ['id', 'product_name', 'price', 'stock', 'category_id'] }],
    });
    if (!tag) return res.status(404).json({ message: 'No tag found with this id' });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/tags
router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create({ tag_name: req.body.tag_name });
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/tags/:id
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Tag.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'No tag found with this id' });
    res.json({ message: 'Tag updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/tags/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Tag.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'No tag found with this id' });
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
