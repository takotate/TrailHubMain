/* eslint-disable */
const { Router } = require('express');

const router = Router();

// Health check
router.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Hikes API
const hikesController = require('../modules/hikes/controller');
router.use('/api/hikes', hikesController);

module.exports = router;

