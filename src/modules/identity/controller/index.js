/* eslint-disable */
const { Router } = require('express');
const { requireRole } = require('../../../app/roles.middleware');

const router = Router();

// GET /api/identity/me
router.get('/me', requireRole(['visitor','hiker','guide','admin']), (req, res) => {
  const user = req.user || { role: 'visitor' };
  res.status(200).json({ id: user.id || null, email: user.email || null, role: user.role });
});

module.exports = router;
