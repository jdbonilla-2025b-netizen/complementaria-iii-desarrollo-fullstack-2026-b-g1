const express = require('express');
const { authenticate, authorize } = require('../auth/middleware');
const { assertOwnerOrAdmin } = require('../auth/ownership');
const tourRepository = require('../repositories/tourRepository');
const { HttpError, asyncHandler } = require('../utils/errors');
const { parseTour } = require('./fincas.routes');

const router = express.Router();

router.use(authenticate, authorize('caficultor', 'admin'));

async function loadOwnedTour(req) {
  const tour = await tourRepository.findById(Number(req.params.id));
  if (!tour) throw new HttpError(404, 'Tour no encontrado');
  assertOwnerOrAdmin(req.user, tour.owner_id); // el tour pertenece a la finca de otro
  return tour;
}

// PUT /api/tours/:id
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const tour = await loadOwnedTour(req);
    const data = { ...parseTour(req.body), active: req.body?.active !== false };
    res.json(await tourRepository.update(tour.id, data));
  })
);

// DELETE /api/tours/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const tour = await loadOwnedTour(req);
    await tourRepository.remove(tour.id);
    res.status(204).end();
  })
);

module.exports = router;
