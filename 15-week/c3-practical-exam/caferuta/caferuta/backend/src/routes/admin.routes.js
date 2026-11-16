const express = require('express');
const { authenticate, authorize } = require('../auth/middleware');
const fincaRepository = require('../repositories/fincaRepository');
const statsRepository = require('../repositories/statsRepository');
const { HttpError, asyncHandler } = require('../utils/errors');
const v = require('../utils/validate');

const router = express.Router();

// Todo este router es exclusivo del rol admin.
router.use(authenticate, authorize('admin'));

// GET /api/admin/stats
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    res.json(await statsRepository.overview());
  })
);

// GET /api/admin/fincas?status=pendiente
router.get(
  '/fincas',
  asyncHandler(async (req, res) => {
    const status = v.oneOf(req.query.status || 'pendiente', 'El estado', ['pendiente', 'aprobada', 'rechazada']);
    res.json(await fincaRepository.listByStatus(status));
  })
);

// PATCH /api/admin/fincas/:id/status { status: "aprobada" | "rechazada" }
router.patch(
  '/fincas/:id/status',
  asyncHandler(async (req, res) => {
    const status = v.oneOf(req.body?.status, 'El estado', ['aprobada', 'rechazada']);
    const finca = await fincaRepository.findById(Number(req.params.id));
    if (!finca) throw new HttpError(404, 'Finca no encontrada');
    res.json(await fincaRepository.setStatus(finca.id, status));
  })
);

module.exports = router;
