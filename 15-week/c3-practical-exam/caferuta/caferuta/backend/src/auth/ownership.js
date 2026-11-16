const { HttpError } = require('../utils/errors');

// AUTORIZACIÓN POR PROPIEDAD: además del rol, ¿este recurso es tuyo?
// Un caficultor solo puede modificar SUS fincas, tours y reservas recibidas.
// El admin puede todo. Se usa dentro de los controladores, después de
// cargar el recurso, porque hay que saber quién es su dueño.
function assertOwnerOrAdmin(user, ownerId) {
  if (user.role === 'admin') return;
  if (Number(ownerId) !== Number(user.id)) {
    throw new HttpError(403, 'Este recurso pertenece a otro usuario');
  }
}

module.exports = { assertOwnerOrAdmin };
