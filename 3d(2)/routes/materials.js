const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Material = require('../models/Material');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const materials = await Material.find().select('-imageUrl');
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, technology, colors, pricePerGram, applicationTypes } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const material = new Material({
      name,
      technology,
      colors: colors.split(','),
      pricePerGram,
      applicationTypes: applicationTypes.split(','),
      imageUrl,
    });

    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, technology, colors, pricePerGram, applicationTypes } = req.body;
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    let imageUrl = material.imageUrl; // Keep the existing image URL if not updating

    // Update the image URL and delete the previous image file if a new image was uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      
      // Delete the previous image file
      if (material.imageUrl) {
        await fs.unlink(`.${material.imageUrl}`);
      }
    }

    material.name = name;
    material.technology = technology;
    material.colors = colors.split(',');
    material.pricePerGram = pricePerGram;
    material.applicationTypes = applicationTypes.split(',');
    material.imageUrl = imageUrl;

    await material.save();
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Check if the imageUrl is a local path or an external URL
    const isExternalUrl = material.imageUrl.startsWith('http://') || material.imageUrl.startsWith('https://');

    // Delete the image file if it's stored locally
    if (!isExternalUrl && material.imageUrl) {
      await fs.unlink(`.${material.imageUrl}`);
    }

    await Material.deleteOne({ _id: req.params.id });
    res.json({ message: 'Material and image deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
