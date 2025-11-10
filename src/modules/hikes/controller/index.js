/* eslint-disable */
// src/modules/hikes/controller/index.js

const { Router } = require('express');
const { requireRole } = require('../../../app/roles.middleware');

const router = Router();

// In-memory mock hikes for development
const hikes = [
  {
    id: 'h-kazbek',
    name: 'Kazbek Summit',
    difficulty: 'Hard',
    location: 'Stepantsminda',
    date: '2025-06-20T08:00:00Z',
    capacity: 12,
    description: 'Summit route with glacier sections.',
    guide: { id: 'g1', name: 'Levan' }
  },
  {
    id: 'h-svaneti',
    name: 'Svaneti Ridge Trail',
    difficulty: 'Moderate',
    location: 'Mestia',
    date: '2025-07-18T07:00:00Z',
    capacity: 18,
    description: 'Classic ridge trail with villages and towers.',
    guide: { id: 'g2', name: 'Nino' }
  },
  {
    id: 'h-tusheti',
    name: 'Tusheti Loop',
    difficulty: 'Moderate',
    location: 'Omalo',
    date: '2025-08-12T06:00:00Z',
    capacity: 10,
    description: 'Remote alpine loop, spectacular views.',
    guide: { id: 'g3', name: 'Beka' }
  }
];

// hikeId -> Set(userId)
const participants = {
  'h-kazbek': new Set(['u_demo']),
  'h-svaneti': new Set(),
  'h-tusheti': new Set()
};

function serializeHike(hike, currentUserId) {
  const pset = participants[hike.id] || new Set();
  return {
    ...hike,
    participantsCount: pset.size,
    isFull: pset.size >= hike.capacity,
    joined: currentUserId ? pset.has(currentUserId) : false
  };
}

// GET /api/hikes
router.get('/', requireRole(['visitor','hiker','guide','admin']), (req, res) => {
  const userId = req.user && req.user.id;
  const list = hikes.map(h => serializeHike(h, userId));
  res.status(200).json(list);
});

// GET /api/hikes/:id
router.get('/:id', requireRole(['visitor','hiker','guide','admin']), (req, res) => {
  const { id } = req.params;
  const hike = hikes.find(h => h.id === id);
  if (!hike) return res.status(404).json({ error: 'Hike not found' });

  const userId = req.user && req.user.id;
  res.status(200).json(serializeHike(hike, userId));
});

// POST /api/hikes/:id/join  (hiker only)
router.post('/:id/join', requireRole('hiker'), (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const hike = hikes.find(h => h.id === id);
  if (!hike) return res.status(404).json({ error: 'Hike not found' });

  const pset = participants[id] || new Set();
  if (pset.has(userId)) return res.status(409).json({ error: 'Already joined' });
  if (pset.size >= hike.capacity) return res.status(409).json({ error: 'Hike is full' });

  pset.add(userId);
  participants[id] = pset;

  return res.status(201).json({
    success: true,
    joined: true,
    participantsCount: pset.size
  });
});

// DELETE /api/hikes/:id/join  (hiker only)
router.delete('/:id/join', requireRole('hiker'), (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const hike = hikes.find(h => h.id === id);
  if (!hike) return res.status(404).json({ error: 'Hike not found' });

  const pset = participants[id] || new Set();
  if (!pset.has(userId)) return res.status(409).json({ error: 'Not a participant' });

  pset.delete(userId);
  participants[id] = pset;

  return res.status(200).json({
    success: true,
    joined: false,
    participantsCount: pset.size
  });
});

module.exports = router;

