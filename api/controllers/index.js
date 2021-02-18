const pool = require('../config/db');
const Servicios = require('../services/servicios');

const obtenerInstructores = async (request, response, next) => {

  try {
    const InstanciaDeServicio = new Servicios(pool);

    const data = await InstanciaDeServicio.obtenerInstructores();

    return response.status(200).json({ estado: 'exito', instructores: data });
  } catch (error) {
    return next(error);
  }
};

const obtenerCursos = async (request, response, next) => {
  try {
    const InstanciaDeServicio = new Servicios(pool);

    const data = await InstanciaDeServicio.obtenerCursos();

    return response.status(200).json({ estado: 'exito', cursos: data });
  } catch (error) {
    return next(error);
  }
};

const obtenerPeriodos = async (request, response, next) => {
  try {
    const InstanciaDeServicio = new Servicios(pool);

    const data = await InstanciaDeServicio.obtenerPeriodos();

    return response.status(200).json({ estado: 'exito', periodos: data });
  } catch (error) {
    return next(error);
  }
};

const eliminarPeriodo = async (request, response, next) => {

  const { idCurso, idInstructor, periodo } = request.body;

  try {
    const InstanciaDeServicio = new Servicios(pool);

    const { eliminado } = await InstanciaDeServicio.eliminarPeriodo(idCurso, idInstructor, periodo);

    return response.status(200).json({ estado: 'exito', eliminado });
  } catch (error) {
    return next(error);
  }
};

const crearPeriodo = async (request, response, next) => {

  const { idCurso, idInstructor, periodo } = request.body;

  try {
    const InstanciaDeServicio = new Servicios(pool);

    const datosObtenidos = await InstanciaDeServicio.crearPeriodo(idCurso, idInstructor, periodo);

    return response.status(200).json({ estado: 'exito', periodo: datosObtenidos });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  obtenerInstructores,
  obtenerCursos,
  obtenerPeriodos,
  eliminarPeriodo,
  crearPeriodo
};