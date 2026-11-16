// Reglas de negocio puras (sin base de datos), fáciles de probar con
// pruebas unitarias.

// ¿Caben `people` personas más en un tour con `capacity` cupos si ya
// hay `alreadyBooked` reservadas (pendientes o confirmadas) ese día?
function availableSpots(capacity, alreadyBooked) {
  return Math.max(0, capacity - alreadyBooked);
}

function canBook(capacity, alreadyBooked, people) {
  return people >= 1 && people <= availableSpots(capacity, alreadyBooked);
}

function totalPrice(pricePerPerson, people) {
  return pricePerPerson * people;
}

// Transiciones de estado permitidas para una reserva y quién puede hacerlas.
const TRANSITIONS = {
  pendiente: { confirmada: ['caficultor', 'admin'], rechazada: ['caficultor', 'admin'], cancelada: ['visitante', 'admin'] },
  confirmada: { cancelada: ['visitante', 'caficultor', 'admin'] },
  rechazada: {},
  cancelada: {},
};

function canTransition(from, to, role) {
  return Boolean(TRANSITIONS[from]?.[to]?.includes(role));
}

module.exports = { availableSpots, canBook, totalPrice, canTransition };
