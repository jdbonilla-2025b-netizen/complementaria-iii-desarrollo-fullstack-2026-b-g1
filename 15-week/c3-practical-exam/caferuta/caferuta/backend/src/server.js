const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`CafeRuta API escuchando en el puerto ${config.port} (${config.nodeEnv})`);
});
