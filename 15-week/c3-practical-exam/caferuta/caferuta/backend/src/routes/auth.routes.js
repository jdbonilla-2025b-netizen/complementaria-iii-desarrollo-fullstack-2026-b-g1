const express = require('express');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const { signAccessToken } = require('../auth/jwt');
const { authenticate } = require('../auth/middleware');
const { HttpError, asyncHandler } = require('../utils/errors');
const v = require('../utils/validate');

const router = express.Router();

function session(user) {
  return {
    token: signAccessToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

// POST /api/auth/register  { name, email, password, role }
// Solo se puede elegir "visitante" o "caficultor": nadie se registra como admin.
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const name = v.text(req.body?.name, 'El nombre', { min: 2, max: 120 });
    const email = v.email(req.body?.email);
    const password = v.password(req.body?.password);
    const role = v.oneOf(req.body?.role || 'visitante', 'El rol', ['visitante', 'caficultor']);

    if (await userRepository.findByEmail(email)) {
      throw new HttpError(409, 'Ya existe una cuenta con ese correo');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, passwordHash, role });
    res.status(201).json(session(user));
  })
);

// POST /api/auth/login  { email, password }  ->  { token, user }
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = req.body?.password;
    if (!email || !password) throw new HttpError(400, 'Correo y contraseña son obligatorios');

    const user = await userRepository.findByEmail(email);
    // Mismo mensaje si el correo no existe o si la clave es incorrecta,
    // para no revelar qué correos están registrados.
    const valid = user && (await bcrypt.compare(password, user.password_hash));
    if (!valid) throw new HttpError(401, 'Correo o contraseña incorrectos');

    res.json(session(user));
  })
);

// GET /api/auth/me -> datos del usuario del token
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await userRepository.findById(req.user.id);
    if (!user) throw new HttpError(404, 'Usuario no encontrado');
    res.json(user);
  })
);

module.exports = router;
