import React, { useEffect, useState } from 'react';
import axios from './config/axios';
import './App.scss';

function App() {

  const periodosDefault = [1, 2, 3, 4, 5];
  const [instructores, setInstructores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [datosFormulario, setDatosFormulario] = useState({
    idCurso: null,
    idInstructor: null,
    periodo: null
  });

  useEffect(() => {
    async function obtenerPeriodos() {
      const periodos = await axios.get('api/periodo');
      setPeriodos(periodos.data.periodos);
    }

    obtenerPeriodos();
  }, []);

  useEffect(() => {
    async function obtenerInstructores() {
      const instructores = await axios.get('api/instructor');
      setInstructores(instructores.data.instructores);
    }

    obtenerInstructores();
  }, []);

  useEffect(() => {
    async function obtenerCursos() {
      const cursos = await axios.get('api/curso');

      const formateando = cursos.data.cursos.map(curso => ({
        id: curso.id,
        nombre: curso.nombre,
        periodoDisponible: periodos.filter(periodo => periodo.idcurso === curso.id).map(el => el.periodo)
      }));

      const tempArr = formateando.map(el => periodosDefault.filter(filter => !el.periodoDisponible.includes(filter)));

      const formateoCompleto = formateando.map((curso, index) => ({
        id: curso.id,
        nombre: curso.nombre,
        periodoDisponible: tempArr[index]
      }));

      console.log("formateo periodos: ", formateoCompleto)

      setCursos(formateoCompleto);
    }

    obtenerCursos();
  }, [periodos]);

  const seleccionarCurso = idcurso => {
    setDatosFormulario({
      ...datosFormulario,
      idCurso: idcurso,
      periodo: null
    });
  };

  const seleccionarInstructor = idInstructor => {
    setDatosFormulario({
      ...datosFormulario,
      idInstructor: idInstructor
    });
  };

  const handleOnChange = e => {
    setDatosFormulario({
      ...datosFormulario,
      periodo: parseInt(e.target.value)
    });
  };

  const handleOnSubmit = e => {
    e.preventDefault();
  };

  const handleAddPeriod = async (idcurso, idinstructor, periodo) => {

    if (idcurso === null || idinstructor === null || periodo === null) {
      return;
    }

    try {
      const datosObtenidos = await axios.post('api/crearPeriodo', {
        idCurso: idcurso,
        idInstructor: idinstructor,
        periodo
      });

      const copiaPeriodos = [...periodos];
      copiaPeriodos.push(datosObtenidos.data.periodo);

      setPeriodos(copiaPeriodos);
      return setDatosFormulario({
        idCurso: null,
        idInstructor: null,
        periodo: null
      });
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleDeletePeriod = async (idcurso, idinstructor, periodo) => {
    try {
      await axios.delete('api/eliminarPeriodo', { data: { idCurso: idcurso, idInstructor: idinstructor, periodo } });

      const encontrarEliminar = periodos.indexOf(periodos.find(periodoAntiguo => periodoAntiguo.idcurso === idcurso && periodoAntiguo.idinstructor === idinstructor && periodoAntiguo.periodo === periodo))
      const copiaPeriodo = [...periodos];

      copiaPeriodo.splice(encontrarEliminar, 1);

      return setPeriodos(copiaPeriodo);
    } catch (error) {
      console.log(error);
      return;
    }

  };

  return (
    <div className="App">
      <div className="Instructores">
        <h1 className="titulo">Instructores</h1>
        {instructores.map(instructor => (
          <div className="Contenedor"
            key={instructor.id}>
            <p>{instructor.nombre} {instructor.apellido}</p>
            <button type="button"
              onClick={() => seleccionarInstructor(instructor.id)}
              style={{ backgroundColor: datosFormulario.idInstructor === instructor.id ? 'green' : '#24a0ed' }}
            >
              {datosFormulario.idInstructor === instructor.id ? 'Seleccionado' : 'Seleccionar'}
            </button>
          </div>
        ))}
      </div>

      <div className="Periodos">
        <form onClick={handleOnSubmit}>
          <div className="fieldWrapper">
            <label htmlFor="seleccion">Periodos Disponibles:</label>
            <select id="seleccion" onChange={handleOnChange}>
              <option value="Selecciona un periodo">Selecciona un periodo...</option>
              {cursos.map(curso => curso.id === datosFormulario.idCurso ? curso.periodoDisponible.map(disponible => (
                <option value={disponible}
                  key={disponible}
                >
                  Periodo {disponible}
                </option>
              )) : null)}
            </select>
          </div>

          <div className="ButtonWrapper">
            <button type="submit"
              onClick={() => handleAddPeriod(datosFormulario.idCurso, datosFormulario.idInstructor, datosFormulario.periodo)}
            >
              Agendar Periodo
            </button>
          </div>
        </form>

        <div className="TablaPeriodos">
          <h1>Periodos Existentes</h1>
          <table className="Tabla">
            <thead>
              <tr>
                <th>N°</th>
                <th>Instructor</th>
                <th>Curso</th>
                <th>Periodo</th>
                <th>Eliminar</th>
              </tr>
            </thead>

            {periodos.map((periodo, index) => (
              <tbody key={index}>
                <tr>
                  <td>{index}</td>
                  <td>{periodo.nombreinstructor} {periodo.apellidoinstructor}</td>
                  <td>{periodo.nombrecurso}</td>
                  <td>{periodo.periodo}</td>
                  <td>
                    <button type="button"
                      className="BotonEliminar"
                      onClick={() => handleDeletePeriod(periodo.idcurso, periodo.idinstructor, periodo.periodo)}>
                      Eliminar Periodo
                      </button>
                  </td>
                </tr>
              </tbody>
            ))}

          </table>
        </div>
      </div>

      <div className="Cursos">
        <h1 className="titulo">Cursos</h1>
        {cursos.map(curso => (
          <div className="Contenedor" key={curso.id}>
            <p>{curso.nombre}</p>
            <button type="button"
              style={{ backgroundColor: datosFormulario.idCurso === curso.id ? 'green' : '#24a0ed' }}
              onClick={() => seleccionarCurso(curso.id)}>
              {datosFormulario.idCurso === curso.id ? 'Seleccionado' : 'Seleccionar'}
            </button>
          </div>
        ))}
      </div>
    </div >
  );
}

export default App;
