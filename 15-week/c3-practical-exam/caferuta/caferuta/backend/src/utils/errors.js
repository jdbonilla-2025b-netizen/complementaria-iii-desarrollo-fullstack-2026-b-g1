// Error con código HTTP: los controladores lo lanzan y el manejador
// central de app.js lo convierte en una respuesta JSON.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Envuelve un handler async para que sus errores lleguen a next().
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { HttpError, asyncHandler };
