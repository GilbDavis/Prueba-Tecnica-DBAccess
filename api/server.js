const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const config = require('./config/config');
const Routes = require('./routes/index');
const cors = require('cors');

app.use(cors());
app.use(express.json({ extended: true }));

app.use(config.api.prefix, Routes);

app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }
  return response.status(parseInt(error.statusCode)).json({ status: error.status, message: error.message, errors: error.data });
});

server.listen(config.port, () => {
  console.log("Servidor iniciado en el puerto: ", config.port);
});