const express = require('express');
const { authenticate, authorize, optionalAuthenticate } = require('../auth/middleware');
const { assertOwnerOrAdmin } = require('../auth/ownership');
const fincaRepository = require('../repositories/fincaRepository');
const tourRepository = require('../repositories/tourRepository');
const resenaRepository = require('../repositories/resenaRepository');
const reservaRepository = require('../repositories/reservaRepository');
const { HttpError, asyncHandler } = require('../utils/errors');
const v = require('../utils/validate');

const router = express.Router();

function parseFinca(body = {}) {
  return {
    name: v.text(body.name, 'El nombre', { min: 3, max: 120 }),
    municipio: v.text(body.municipio, 'El municipio', { max: 80 }),
    departamento: v.text(body.departamento, 'El departamento', { max: 80 }),
    altitud_msnm: v.int(body.altitud_msnm, 'La altitud', { min: 500, max: 3000 }),
    variedades: v.text(body.variedades, 'Las variedades', { max: 255 }),
    description: v.text(body.description, 'La descripción', { min: 20, max: 2000 }),
  };
}

function parseTour(body = {}) {
  return {
    title: v.text(body.title, 'El título', { min: 3, max: 120 }),
    description: v.text(body.description, 'La descripción', { min: 10, max: 1000 }),
    duration_hours: v.int(body.duration_hours, 'La duración', { min: 1, max: 12 }),
    price_cop: v.int(body.price_cop, 'El precio', { min: 1000, max: 5000000 }),
    capacity: v.int(body.capacity, 'La capacidad', { min: 1, max: 100 }),
  };
}

async function loadFinca(id) {
  const finca = await fincaRepository.findById(Number(id));
  if (!finca) throw new HttpError(404, 'Finca no encontrada');
  return finca;
}

// ---------- Públicas ----------

// GET /api/fincas?departamento=Quindío&q=salento
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const [fincas, ratings] = await Promise.all([
      fincaRepository.listApproved({ departamento: req.query.departamento, q: req.query.q }),
      resenaRepository.summaries(),
    ]);
    res.json(fincas.map((f) => ({ ...f, rating: ratings[f.id] || { average: null, count: 0 } })));
  })
);

router.get(
  '/departamentos',
  asyncHandler(async (req, res) => {
    res.json(await fincaRepository.listDepartamentos());
  })
);

// ---------- Caficultor: mis fincas ----------
// (va antes de "/:id" para que "mine" no se interprete como un id)
router.get(
  '/mine',
  authenticate,
  authorize('caficultor'),
  asyncHandler(async (req, res) => {
    const fincas = await fincaRepository.listByOwner(req.user.id);
    const withTours = await Promise.all(
      fincas.map(async (f) => ({ ...f, tours: await tourRepository.listByFinca(f.id, { onlyActive: false }) }))
    );
    res.json(withTours);
  })
);

// GET /api/fincas/:id -> detalle con tours y reseñas.
// Una finca no aprobada solo la ve su dueño o un admin.
router.get(
  '/:id',
  optionalAuthenticate,
  asyncHandler(async (req, res) => {
    const finca = await loadFinca(req.params.id);
    const isOwnerOrAdmin = req.user && (req.user.role === 'admin' || req.user.id === finca.owner_id);
    if (finca.status !== 'aprobada' && !isOwnerOrAdmin) throw new HttpError(404, 'Finca no encontrada');

    const [tours, resenas, ratings] = await Promise.all([
      tourRepository.listByFinca(finca.id),
      resenaRepository.listByFinca(finca.id),
      resenaRepository.summaries(),
    ]);
    res.json({ ...finca, tours, resenas, rating: ratings[finca.id] || { average: null, count: 0 } });
  })
);

// POST /api/fincas -> el caficultor registra una finca (queda "pendiente")
router.post(
  '/',
  authenticate,
  authorize('caficultor'),
  asyncHandler(async (req, res) => {
    const finca = await fincaRepository.create(req.user.id, parseFinca(req.body));
    res.status(201).json(finca);
  })
);

// PUT /api/fincas/:id -> rol caficultor/admin Y ser el dueño
router.put(
  '/:id',
  authenticate,
  authorize('caficultor', 'admin'),
  asyncHandler(async (req, res) => {
    const finca = await loadFinca(req.params.id);
    assertOwnerOrAdmin(req.user, finca.owner_id);
    res.json(await fincaRepository.update(finca.id, parseFinca(req.body)));
  })
);

// POST /api/fincas/:id/tours -> crear tour en MI finca
router.post(
  '/:id/tours',
  authenticate,
  authorize('caficultor', 'admin'),
  asyncHandler(async (req, res) => {
    const finca = await loadFinca(req.params.id);
    assertOwnerOrAdmin(req.user, finca.owner_id);
    res.status(201).json(await tourRepository.create(finca.id, parseTour(req.body)));
  })
);

// POST /api/fincas/:id/resenas -> solo visitantes con una reserva confirmada allí
router.post(
  '/:id/resenas',
  authenticate,
  authorize('visitante'),
  asyncHandler(async (req, res) => {
    const finca = await loadFinca(req.params.id);
    const rating = v.int(req.body?.rating, 'La calificación', { min: 1, max: 5 });
    const comment = v.text(req.body?.comment, 'El comentario', { min: 5, max: 1000 });

    if (!(await reservaRepository.hasConfirmedAtFinca(req.user.id, finca.id))) {
      throw new HttpError(403, 'Solo puedes reseñar fincas donde tuviste una reserva confirmada');
    }
    if (await resenaRepository.exists(finca.id, req.user.id)) {
      throw new HttpError(409, 'Ya reseñaste esta finca');
    }
    const resena = await resenaRepository.create({ fincaId: finca.id, userId: req.user.id, rating, comment });
    res.status(201).json({ ...resena, author: req.user.name });
  })
);

module.exports = router;
module.exports.parseTour = parseTour;
