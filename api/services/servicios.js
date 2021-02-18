/* eslint-disable no-useless-catch */
const { DatabaseError } = require('../utils/error');

class Servicios {
  constructor(database) {
    this.database = database;
  }

  async obtenerInstructores() {
    try {
      const instructores = await this.database.query('SELECT id, nombre, apellido FROM "Instructor"');
      if (!instructores) {
        throw new DatabaseError(500, 'Error al consultar la Base de Datos.', 'error');
      }

      return instructores.rows;
    } catch (error) {
      throw error;
    }
  }

  async obtenerCursos() {
    try {
      const cursos = await this.database.query('SELECT id, nombre FROM "Curso"');
      if (!cursos) {
        throw new DatabaseError(500, 'Error al consultar la Base de Datos.', 'error');
      }

      return cursos.rows;
    } catch (error) {
      throw error;
    }
  }

  async obtenerPeriodos() {
    try {
      const periodos = await this.database.query(`
      SELECT
      "Curso".id as idcurso,
      "Curso".nombre AS nombrecurso,
      "Instructor".id as idinstructor,
      "Instructor".nombre as nombreinstructor,
      "Instructor".apellido as apellidoinstructor,
      "Periodo".periodo as periodo
     FROM
      "Curso", "Instructor", "Periodo"
     WHERE
      "Curso".id = "Periodo".idcurso
     AND
      "Instructor".id = "Periodo".idinstructor
      Order by "Curso".id ASC,
      "Periodo".periodo ASC
      `);

      if (!periodos) {
        throw new DatabaseError(500, 'Error al consultar la Base de Datos.', 'error');
      }

      return periodos.rows;
    } catch (error) {
      throw error;
    }
  }

  async eliminarPeriodo(idCurso, idInstructor, periodo) {
    try {
      const eliminarPeriodos = await this.database.query('DELETE FROM "Periodo" WHERE idcurso= $1 AND idinstructor= $2 AND periodo= $3',
        [idCurso, idInstructor, periodo]);

      if (eliminarPeriodos.rowCount === 0) {
        return { eliminado: false };
      }

      return { eliminado: true };
    } catch (error) {
      throw error;
    }
  }

  async crearPeriodo(idCurso, idInstructor, periodo) {
    try {
      const crearPedido = await this.database.query('INSERT INTO "Periodo"(idcurso, idinstructor, periodo) VALUES ($1, $2, $3) RETURNING idcurso, idinstructor, periodo',
        [idCurso, idInstructor, periodo]);

      if (!crearPedido) {
        throw new DatabaseError(500, 'Error al consultar la Base de Datos.', 'error');
      }

      const periodos = await this.database.query(`
      SELECT
      "Curso".id as idcurso,
      "Curso".nombre AS nombrecurso,
      "Instructor".id as idinstructor,
      "Instructor".nombre as nombreinstructor,
      "Instructor".apellido as apellidoinstructor
     FROM
      "Curso", "Instructor"
     WHERE
      "Curso".id = $1
     AND
      "Instructor".id = $2
      `, [crearPedido.rows[0].idcurso, crearPedido.rows[0].idinstructor]);

      if (!periodos) {
        throw new DatabaseError(500, 'Error al consultar la Base de Datos.', 'error');
      }

      return {
        idcurso: periodos.rows[0].idcurso,
        nombrecurso: periodos.rows[0].nombrecurso,
        idinstructor: periodos.rows[0].idinstructor,
        nombreinstructor: periodos.rows[0].nombreinstructor,
        apellidoinstructor: periodos.rows[0].apellidoinstructor,
        periodo: crearPedido.rows[0].periodo
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Servicios;