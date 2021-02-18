const express = require('express');
const route = express.Router();
const {
  obtenerInstructores,
  obtenerCursos,
  obtenerPeriodos,
  eliminarPeriodo,
  crearPeriodo } = require('../controllers/index');

route.get("/instructor", obtenerInstructores);
route.get("/curso", obtenerCursos);
route.get("/periodo", obtenerPeriodos);
route.delete("/eliminarPeriodo", eliminarPeriodo);
route.post('/crearPeriodo', crearPeriodo);

module.exports = route;