import { useState } from 'react';
import './App.css';

function App() {
  const [cursoSeleccionado, setCursoSeleccionado] = useState('todos');
  const [cursos, setCursos] = useState([
    {
      id: 1,
      titulo: "Desarrollo Web",
      descripcion: "Aprende HTML, CSS y JavaScript",
      categoria: "tecnico",
      imagen: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      titulo: "Programación en Python",
      descripcion: "Fundamentos de programación con Python",
      categoria: "tecnico",
      imagen: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      titulo: "Base de Datos",
      descripcion: "Diseño y gestión de bases de datos",
      categoria: "tecnico",
      imagen: "https://via.placeholder.com/150"
    }
  ]);
  const [nuevoCurso, setNuevoCurso] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'tecnico',
    imagen: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoCurso({
      ...nuevoCurso,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoCursoConId = {
      ...nuevoCurso,
      id: cursos.length + 1
    };
    setCursos([...cursos, nuevoCursoConId]);
    setNuevoCurso({
      titulo: '',
      descripcion: '',
      categoria: 'tecnico',
      imagen: ''
    });
  };

  const filtrarCursos = (categoria) => {
    setCursoSeleccionado(categoria);
  };

  const cursosAMostrar = cursoSeleccionado === 'todos' 
    ? cursos 
    : cursos.filter(curso => curso.categoria === cursoSeleccionado);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cursos Técnicos</h1>
        
        {/* Formulario de creación de curso */}
        <div className="formulario-curso">
          <h2>Crear Nuevo Curso</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titulo">Nombre del Curso:</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={nuevoCurso.titulo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion">Descripción:</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={nuevoCurso.descripcion}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="imagen">URL de la imagen:</label>
              <input
                type="url"
                id="imagen"
                name="imagen"
                value={nuevoCurso.imagen}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn-crear">Crear Curso</button>
          </form>
        </div>

        {/* Filtros */}
        <div className="filtros">
          <button 
            onClick={() => filtrarCursos('todos')}
            className={cursoSeleccionado === 'todos' ? 'activo' : ''}
          >
            Todos
          </button>
          <button 
            onClick={() => filtrarCursos('tecnico')}
            className={cursoSeleccionado === 'tecnico' ? 'activo' : ''}
          >
            Técnicos
          </button>
        </div>

        {/* Grid de cursos */}
        <div className="cursos-grid">
          {cursosAMostrar.map(curso => (
            <div key={curso.id} className="curso-card">
              <img src={curso.imagen} alt={curso.titulo} />
              <h3>{curso.titulo}</h3>
              <p>{curso.descripcion}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
