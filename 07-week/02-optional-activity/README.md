# 07 — API

## Estado de esta sección: No aplica

UrbanStyle E-Commerce es una aplicación **puramente frontend**: no tiene
servidor propio, no expone ninguna ruta HTTP, y no implementa autenticación
ni persistencia propia. Todo el código corre en el navegador del cliente
(React vía Babel standalone, cargado con `<script type="text/babel">` desde
`index.html`), sin ningún backend detrás.

Esta sección del framework (`07-api`) gobierna **la única API HTTP que la
aplicación expone a sus clientes**: nombres de recursos, versionado, códigos
de estado, forma de los errores y paginación. Como esta aplicación no expone
ninguna API — no hay clientes de la aplicación distintos del propio
navegador, ni endpoints propios que versionar o proteger — no hay nada que
gobernar aquí.

## Lo que sí existe: una API externa consumida

La aplicación **consume** una API pública de terceros, DummyJSON
(`GET https://dummyjson.com/products?limit=0`), a través de `fetch` en el
componente `App` (función `cargarCatalogo`, en `app.jsx`). Esa es una
dependencia externa, no un contrato que la aplicación defina o controle, por
lo que:

- No se documenta con una plantilla OpenAPI propia (`_template-api.yaml`),
  porque esa plantilla describe endpoints que la aplicación expone, y aquí
  no hay ninguno.
- Su documentación (forma de la respuesta, mapeo de categorías a las
  secciones de la tienda, conversión de precio USD → COP, y el manejo de los
  estados de carga y error) vive en
  [`../06-data/README.md`](../06-data/README.md), que es la sección
  correcta para describir de dónde vienen los datos y cómo se transforman.

## Por qué no se fuerza la plantilla

Rellenar `_template-api.yaml` con recursos inventados (`Product` con `sku`,
`categoryId` como UUID, autenticación `bearerAuth`) documentaría una API que
el código no implementa. Eso contradice el propio código fuente del
proyecto y no se sostiene frente a una revisión que compare esta
documentación con la aplicación real.

## Si el proyecto evoluciona

Si en una fase futura este proyecto agrega un backend propio (por ejemplo,
para persistir el carrito o gestionar pedidos), esta sección deja de ser "No
aplica" y debe llenarse siguiendo
[`rest-conventions.md`](./rest-conventions.md) y copiando
`contracts/openapi/_template-api.yaml` por cada grupo de recursos que ese
backend exponga.

---

**Related:** [`../06-data/README.md`](../06-data/README.md) · [`../09-modules/README.md`](../09-modules/README.md)
