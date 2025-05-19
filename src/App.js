import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';

// Componente para la página de detalle del curso
function DetalleCurso({ cursos }) {
  const { id } = useParams();
  const curso = cursos.find(c => c.id === parseInt(id));
  const [nuevaPublicacion, setNuevaPublicacion] = useState({
    titulo: '',
    descripcion: '',
    cursoId: parseInt(id),
    fechaCreacion: new Date().toISOString().split('T')[0]
  });
  const [publicaciones, setPublicaciones] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaPublicacion({
      ...nuevaPublicacion,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const publicacionConId = {
      ...nuevaPublicacion,
      id: Date.now(),
      cursoNombre: curso.titulo
    };
    setPublicaciones([...publicaciones, publicacionConId]);
    setNuevaPublicacion({
      titulo: '',
      descripcion: '',
      cursoId: parseInt(id),
      fechaCreacion: new Date().toISOString().split('T')[0]
    });
  };

  if (!curso) {
    return <div className="detalle-curso">Curso no encontrado</div>;
  }

  return (
    <div className="detalle-curso">
      <h1>{curso.titulo}</h1>
      <img src={curso.imagen} alt={curso.titulo} />
      <p>{curso.descripcion}</p>
      <p>Categoría: {curso.categoria}</p>
      
      {/* Formulario para crear publicaciones */}
      <div className="formulario-publicacion">
        <h2>Crear Nueva Publicación</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título:</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={nuevaPublicacion.titulo}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción detallada de la actividad:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={nuevaPublicacion.descripcion}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cursoId">Curso asociado:</label>
            <input
              type="text"
              id="cursoId"
              value={curso.titulo}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="fechaCreacion">Fecha de creación:</label>
            <input
              type="date"
              id="fechaCreacion"
              name="fechaCreacion"
              value={nuevaPublicacion.fechaCreacion}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn-crear">Crear Publicación</button>
        </form>
      </div>

      {/* Lista de publicaciones */}
      {publicaciones.length > 0 && (
        <div className="publicaciones-lista">
          <h2>Publicaciones</h2>
          {publicaciones.map(pub => (
            <div key={pub.id} className="publicacion-card">
              <h3>{pub.titulo}</h3>
              <p>{pub.descripcion}</p>
              <p className="publicacion-meta">
                Curso: {pub.cursoNombre} | Fecha: {pub.fechaCreacion}
              </p>
            </div>
          ))}
        </div>
      )}
      
      <Link to="/" className="btn-volver">Volver a la lista</Link>
    </div>
  );
}

// Componente para la página principal
function PaginaPrincipal({ cursos, setCursos, nuevoCurso, setNuevoCurso, cursoSeleccionado, setCursoSeleccionado }) {
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
            <Link to={`/curso/${curso.id}`} key={curso.id} className="curso-card">
              <img src={curso.imagen} alt={curso.titulo} />
              <h3>{curso.titulo}</h3>
              <p>{curso.descripcion}</p>
            </Link>
          ))}
        </div>
      </header>
    </div>
  );
}

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

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PaginaPrincipal 
            cursos={cursos} 
            setCursos={setCursos} 
            nuevoCurso={nuevoCurso} 
            setNuevoCurso={setNuevoCurso} 
            cursoSeleccionado={cursoSeleccionado} 
            setCursoSeleccionado={setCursoSeleccionado} 
          />
        } />
        <Route path="/curso/:id" element={<DetalleCurso cursos={cursos} />} />
      </Routes>
    </Router>
  );
}

export default App;
