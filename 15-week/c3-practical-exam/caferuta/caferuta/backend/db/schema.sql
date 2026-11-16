-- Esquema de CafeRuta. Lo usan Docker (init) y las pruebas de integración.

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'visitante'
                CHECK (role IN ('visitante', 'caficultor', 'admin')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fincas (
  id           SERIAL PRIMARY KEY,
  owner_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         VARCHAR(120) NOT NULL,
  municipio    VARCHAR(80)  NOT NULL,
  departamento VARCHAR(80)  NOT NULL,
  altitud_msnm INTEGER      NOT NULL,
  variedades   VARCHAR(255) NOT NULL,
  description  TEXT         NOT NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'pendiente'
               CHECK (status IN ('pendiente', 'aprobada', 'rechazada')),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tours (
  id             SERIAL PRIMARY KEY,
  finca_id       INTEGER NOT NULL REFERENCES fincas(id) ON DELETE CASCADE,
  title          VARCHAR(120) NOT NULL,
  description    TEXT         NOT NULL,
  duration_hours INTEGER      NOT NULL,
  price_cop      INTEGER      NOT NULL,
  capacity       INTEGER      NOT NULL,
  active         BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reservas (
  id         SERIAL PRIMARY KEY,
  tour_id    INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date       DATE    NOT NULL,
  people     INTEGER NOT NULL,
  total_cop  INTEGER NOT NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'pendiente'
             CHECK (status IN ('pendiente', 'confirmada', 'rechazada', 'cancelada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resenas (
  id         SERIAL PRIMARY KEY,
  finca_id   INTEGER NOT NULL REFERENCES fincas(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT    NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (finca_id, user_id)
);
