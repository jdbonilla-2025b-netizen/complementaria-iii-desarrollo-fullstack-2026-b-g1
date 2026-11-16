-- Datos de demostración de CafeRuta.
-- Contraseña de todos los usuarios: Cafe2026!
-- (hash bcrypt generado con: npm run hash -- "Cafe2026!")

INSERT INTO users (name, email, password_hash, role) VALUES
  ('Administración CafeRuta', 'admin@caferuta.co',  '$2a$10$a2ZqqN0h1qjjOl0SKNqkNumTaioVkZlTZPXJaHcLmCDR3zl6Uo1F6', 'admin'),
  ('Jorge Valencia',          'jorge@caferuta.co',  '$2a$10$a2ZqqN0h1qjjOl0SKNqkNumTaioVkZlTZPXJaHcLmCDR3zl6Uo1F6', 'caficultor'),
  ('Marta Ospina',            'marta@caferuta.co',  '$2a$10$a2ZqqN0h1qjjOl0SKNqkNumTaioVkZlTZPXJaHcLmCDR3zl6Uo1F6', 'caficultor'),
  ('Laura Gómez',             'laura@caferuta.co',  '$2a$10$a2ZqqN0h1qjjOl0SKNqkNumTaioVkZlTZPXJaHcLmCDR3zl6Uo1F6', 'visitante'),
  ('Andrés Rincón',           'andres@caferuta.co', '$2a$10$a2ZqqN0h1qjjOl0SKNqkNumTaioVkZlTZPXJaHcLmCDR3zl6Uo1F6', 'visitante');

-- Fincas: owner_id 2 = Jorge, 3 = Marta
INSERT INTO fincas (owner_id, name, municipio, departamento, altitud_msnm, variedades, description, status) VALUES
  (2, 'Hacienda Monteverde', 'Salento', 'Quindío', 1850, 'Castillo, Caturra',
   'Finca familiar de tercera generación entre palmas de cera. Recorrido por el cafetal, beneficio húmedo y secado en marquesina, con vista al valle de Cocora.', 'aprobada'),
  (2, 'Finca Los Arrayanes', 'Chinchiná', 'Caldas', 1400, 'Colombia, Castillo',
   'Cafetal tradicional con sombrío de guamo y plátano. Ideal para familias: recolección guiada, almuerzo campesino y taller de barismo básico.', 'aprobada'),
  (3, 'Alto de la Neblina', 'Pitalito', 'Huila', 1720, 'Geisha, Pink Bourbon',
   'Microlotes de especialidad premiados en catas regionales. Tour enfocado en procesos experimentales: honey, natural y fermentaciones controladas.', 'aprobada'),
  (3, 'Finca La Guacharaca', 'Jardín', 'Antioquia', 1600, 'Caturra, Tabi',
   'Finca de montaña rodeada de bosque de niebla, a 20 minutos del pueblo. Caminata por el cafetal, avistamiento de aves y cata guiada al atardecer.', 'aprobada'),
  (3, 'Finca Agua Clara', 'Buesaco', 'Nariño', 2100, 'Castillo, Typica',
   'Cafés de altura del sur del país con notas cítricas. Finca recién registrada en la plataforma, pendiente de revisión por el equipo de CafeRuta.', 'pendiente');

INSERT INTO tours (finca_id, title, description, duration_hours, price_cop, capacity) VALUES
  (1, 'Del grano a la taza', 'Recorrido completo: recolección, despulpado, secado, tostión y cata de tres perfiles.', 3, 85000, 12),
  (1, 'Amanecer cafetero', 'Caminata al alba por el cafetal con desayuno típico y café de origen recién preparado.', 2, 60000, 8),
  (2, 'Recolector por un día', 'Con canasto al cinto, aprende a escoger solo el grano maduro junto a los recolectores.', 4, 70000, 15),
  (3, 'Laboratorio de procesos', 'Cata comparativa de lavado, honey y natural del mismo lote. Incluye bolsa de 250 g.', 3, 120000, 6),
  (4, 'Café y aves de niebla', 'Caminata guiada por el bosque, avistamiento de aves y cata al atardecer.', 4, 95000, 10);

-- Reservas: Laura (4) ya visitó Monteverde y Alto de la Neblina; Andrés (5) tiene una pendiente.
INSERT INTO reservas (tour_id, user_id, date, people, total_cop, status) VALUES
  (1, 4, '2026-09-12', 2, 170000, 'confirmada'),
  (4, 4, '2026-10-03', 1, 120000, 'confirmada'),
  (3, 5, '2026-12-20', 3, 210000, 'pendiente'),
  (5, 4, '2027-01-10', 2, 190000, 'pendiente');

INSERT INTO resenas (finca_id, user_id, rating, comment) VALUES
  (1, 4, 5, 'Don Jorge explica cada paso con mucha paciencia. La cata final fue lo mejor del viaje.'),
  (3, 4, 4, 'Increíble probar el mismo café con tres procesos distintos. El camino es destapado, lleven buen calzado.');
