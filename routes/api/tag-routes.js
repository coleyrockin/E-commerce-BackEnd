const router = require('express').Router();
const { Tag, Product } = require('../../models');
const { requireWriteApiKey } = require('../../middleware/write-auth');
const { validateIdParam, validateTagPayload } = require('../../utils/validators');

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
    const id = validateIdParam(req.params.id);
    const tag = await Tag.findOne({
      where: { id },
      attributes: ['id', 'tag_name'],
      include: [{ model: Product, attributes: ['id', 'product_name', 'price', 'stock', 'category_id'] }],
    });

    if (!tag) return res.status(404).json({ message: 'No tag found with this id' });
    return res.json(tag);
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// POST /api/tags
router.post('/', requireWriteApiKey, async (req, res) => {
  try {
    const tagPayload = validateTagPayload(req.body);
    const tag = await Tag.create(tagPayload);
    return res.status(201).json(tag);
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// PUT /api/tags/:id
router.put('/:id', requireWriteApiKey, async (req, res) => {
  try {
    const id = validateIdParam(req.params.id);
    const tagPayload = validateTagPayload(req.body);
    const [updated] = await Tag.update(tagPayload, { where: { id } });

    if (!updated) return res.status(404).json({ message: 'No tag found with this id' });
    return res.json({ message: 'Tag updated' });
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

// DELETE /api/tags/:id
router.delete('/:id', requireWriteApiKey, async (req, res) => {
  try {
    const id = validateIdParam(req.params.id);
    const deleted = await Tag.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'No tag found with this id' });
    return res.json({ message: 'Tag deleted' });
  } catch (err) {
    return res.status(400).json({ message: 'Bad request', error: err.message });
  }
});

module.exports = router;
