var express = require('express');
var router = express.Router();
const University = require('../models/University');

router.get('/', async (req, res) => {
    try {
        const universities = await University.find({});
        res.json(universities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch universities' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const university = await University.findById(req.params.id);
        if (!university) {
            return res.status(404).json({ error: 'University not found' });
        }
        res.json(university);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch university' });
    }
});

router.post('/', async (req, res) => {
    const { moto, name, image, logo, about, cover, contact, feeStructure } = req.body;

    try {
        const newUniversity = new University({
            moto,
            name,
            image,
            logo,
            about,
            cover,
            contact,
            feeStructure
        });
        const savedUniversity = await newUniversity.save();
        
        console.log(savedUniversity)
        res.status(200).json(savedUniversity);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to create university' });
    }
});

router.put('/:id', async (req, res) => {
    const { moto, name, image, logo, about, cover, contact, feeStructure } = req.body;

    try {
        const updatedUniversity = await University.findByIdAndUpdate(
            req.params.id,
            { moto, name, image, logo, about, cover, contact, feeStructure },
            { new: true }
        );

        if (!updatedUniversity) {
            return res.status(404).json({ error: 'University not found' });
        }

        res.json(updatedUniversity);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update university' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUniversity = await University.findByIdAndDelete(req.params.id);
        if (!deletedUniversity) {
            return res.status(404).json({ error: 'University not found' });
        }
        res.json({ message: 'University deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete university' });
    }
});

module.exports = router;
