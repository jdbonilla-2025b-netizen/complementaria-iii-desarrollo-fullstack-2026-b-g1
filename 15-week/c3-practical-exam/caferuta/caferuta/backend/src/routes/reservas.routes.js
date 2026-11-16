const express = require('express');
const { authenticate, authorize } = require('../auth/middleware');
const tourRepository = require('../repositories/tourRepository');
const reservaRepository = require('../repositories/reservaRepository');
const { canBook, availableSpots, totalPrice, canTransition } = require('../services/reservationRules');
const { HttpError, asyncHandler } = require('../utils/errors');
const v = require('../utils/validate');

const router = express.Router();

router.use(authenticate);

// POST /api/reservas { tour_id, date, people } -> solo visitantes
router.post(
  '/',
  authorize('visitante'),
  asyncHandler(async (req, res) => {
    const tourId = v.int(req.body?.tour_id, 'El tour', { min: 1 });
    const date = v.futureDate(req.body?.date, 'La fecha');
    const people = v.int(req.body?.people, 'El número de personas', { min: 1, max: 20 });

    const tour = await tourRepository.findById(tourId);
    if (!tour || !tour.active || tour.finca_status !== 'aprobada') {
      throw new HttpError(404, 'Tour no disponible');
    }

    const booked = await reservaRepository.bookedPeople(tour.id, date);
    if (!canBook(tour.capacity, booked, people)) {
      throw new HttpError(409, `Solo quedan ${availableSpots(tour.capacity, booked)} cupos para esa fecha`);
    }

    const reserva = await reservaRepository.create({
      tourId: tour.id,
      userId: req.user.id,
      date,
      people,
      totalCop: totalPrice(tour.price_cop, people),
    });
    res.status(201).json(reserva);
  })
);

// GET /api/reservas/mine -> reservas que YO hice
router.get(
  '/mine',
  authorize('visitante'),
  asyncHandler(async (req, res) => {
    res.json(await reservaRepository.listByUser(req.user.id));
  })
);

// GET /api/reservas/recibidas -> reservas en MIS fincas (caficultor)
router.get(
  '/recibidas',
  authorize('caficultor'),
  asyncHandler(async (req, res) => {
    res.json(await reservaRepository.listForOwner(req.user.id));
  })
);

// PATCH /api/reservas/:id/status { status }
// Quién puede qué:
//  - visitante: cancelar SOLO sus reservas
//  - caficultor: confirmar/rechazar/cancelar SOLO reservas de sus fincas
//  - admin: cualquiera
router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const status = v.oneOf(req.body?.status, 'El estado', ['confirmada', 'rechazada', 'cancelada']);
    const reserva = await reservaRepository.findById(Number(req.params.id));
    if (!reserva) throw new HttpError(404, 'Reserva no encontrada');

    const { role, id } = req.user;
    const isMine =
      (role === 'visitante' && reserva.user_id === id) ||
      (role === 'caficultor' && reserva.owner_id === id) ||
      role === 'admin';
    if (!isMine) throw new HttpError(403, 'Esta reserva no te pertenece');

    if (!canTransition(reserva.status, status, role)) {
      throw new HttpError(409, `No se puede pasar de "${reserva.status}" a "${status}"`);
    }
    res.json(await reservaRepository.setStatus(reserva.id, status));
  })
);

module.exports = router;
