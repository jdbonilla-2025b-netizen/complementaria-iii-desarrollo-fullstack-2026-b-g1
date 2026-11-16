const { verifyAccessToken } = require('./jwt');

// AUTENTICACIÓN: ¿quién eres?
// Lee "Authorization: Bearer <token>", verifica el JWT y deja el usuario en req.user.
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Debes iniciar sesión' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: Number(payload.sub), role: payload.role, name: payload.name };
    return next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Tu sesión expiró' : 'Token inválido';
    return res.status(401).json({ error: message });
  }
}

// AUTORIZACIÓN POR ROL: ¿tu rol puede usar esta ruta?
// Se usa DESPUÉS de authenticate.
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Debes iniciar sesión' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permiso para esta acción' });
    }
    return next();
  };
}

// Autenticación OPCIONAL para rutas públicas que muestran algo extra al
// dueño (por ejemplo, ver su finca aunque todavía esté "pendiente").
function optionalAuthenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme === 'Bearer' && token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = { id: Number(payload.sub), role: payload.role, name: payload.name };
    } catch {
      // token inválido en ruta pública: se trata como visitante anónimo
    }
  }
  next();
}

module.exports = { authenticate, authorize, optionalAuthenticate };
