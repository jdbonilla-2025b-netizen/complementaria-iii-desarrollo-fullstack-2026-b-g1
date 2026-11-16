// PRUEBA UNITARIA de reglas de negocio puras: cupos, precio y estados.
const { availableSpots, canBook, totalPrice, canTransition } = require('../../src/services/reservationRules');

describe('cupos de un tour', () => {
  test('calcula los cupos libres', () => {
    expect(availableSpots(12, 5)).toBe(7);
    expect(availableSpots(12, 15)).toBe(0); // nunca negativo
  });

  test('permite reservar mientras haya cupo y lo impide al superarlo', () => {
    expect(canBook(12, 10, 2)).toBe(true);
    expect(canBook(12, 10, 3)).toBe(false);
    expect(canBook(12, 0, 0)).toBe(false);
  });
});

test('el total es precio por persona por número de personas', () => {
  expect(totalPrice(85000, 2)).toBe(170000);
});

describe('transiciones de estado de una reserva', () => {
  test('el caficultor confirma una pendiente; el visitante no puede', () => {
    expect(canTransition('pendiente', 'confirmada', 'caficultor')).toBe(true);
    expect(canTransition('pendiente', 'confirmada', 'visitante')).toBe(false);
  });

  test('una reserva cancelada no puede volver a confirmarse', () => {
    expect(canTransition('cancelada', 'confirmada', 'admin')).toBe(false);
  });
});
