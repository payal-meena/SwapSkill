const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const uploadAny = require('../middleware/uploadAnyMiddleware');
const { uploadFile } = require('../controllers/uploadController');

// POST /api/uploads - field name: file
router.post('/', protect, uploadAny.single('file'), uploadFile);

module.exports = router;
