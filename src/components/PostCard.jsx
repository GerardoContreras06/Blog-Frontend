import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { courseService, commentService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function PostCard({ post }) {
  const [courseName, setCourseName] = useState('Cargando...');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Formatear la fecha si existe
  const formattedDate = post.creationDate 
    ? new Date(post.creationDate).toLocaleDateString() 
    : 'Fecha no disponible';

  // Obtener el nombre del curso a partir del ID
  useEffect(() => {
    const fetchCourseName = async () => {
      // Depurar la información de la publicación
      console.log('Información de la publicación:', post);
      
      if (!post.course) {
        setCourseName('Sin categoría');
        return;
      }
      
      try {
        // Verificar si course es un string (ID) o un objeto
        const courseId = typeof post.course === 'string' ? post.course : 
                        (post.course && post.course._id) ? post.course._id : null;
        
        console.log('ID del curso a buscar:', courseId);
        
        if (!courseId) {
          setCourseName('Sin categoría');
          return;
        }
        
        // Hacer la petición al backend
        const response = await courseService.getCourseById(courseId);
        
        // Depurar la respuesta completa
        console.log('Respuesta completa del servidor:', response);
        
        // Verificar la respuesta y extraer el nombre del curso
        if (response && response.data) {
          console.log('Datos de la respuesta:', response.data);
          
          if (response.data.course) {
            const course = response.data.course;
            console.log('Objeto curso:', course);
            
            // Mostrar todas las propiedades del curso
            Object.keys(course).forEach(key => {
              console.log(`Propiedad ${key}:`, course[key]);
            });
            
            if (course.nameCourse) {
              setCourseName(course.nameCourse);
            } else if (course.name) {
              setCourseName(course.name);
            } else {
              // Buscar cualquier propiedad que sea string y no sea _id
              let foundName = false;
              const courseKeys = Object.keys(course);
              for (const key of courseKeys) {
                if (typeof course[key] === 'string' && key !== '_id') {
                  setCourseName(course[key]);
                  foundName = true;
                  break;
                }
              }
              
              if (!foundName) {
                // Si no encontramos ninguna propiedad adecuada, mostrar el ID como string
                setCourseName(courseId.toString());
              }
            }
          } else {
            // Si no hay un objeto course en la respuesta, intentar buscar en la raíz
            if (response.data.nameCourse) {
              setCourseName(response.data.nameCourse);
            } else if (response.data.name) {
              setCourseName(response.data.name);
            } else {
              setCourseName('Curso #' + courseId.toString().substring(0, 5));
            }
          }
        } else {
          // Si no hay respuesta válida, mostrar el ID parcial
          setCourseName('Curso #' + courseId.toString().substring(0, 5));
        }
      } catch (error) {
        console.error('Error al obtener el curso:', error);
        // En caso de error, mostrar información sobre el error
        setCourseName('Error: ' + (error.message || 'Desconocido'));
      }
    };

    fetchCourseName();
  }, [post.course]);

  // Cargar comentarios cuando se muestra el formulario
  useEffect(() => {
    if (showCommentForm) {
      fetchComments();
    }
  }, [showCommentForm]);

  // Función para cargar los comentarios
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentService.getCommentsByPublication(post._id);
      if (response.data && response.data.success) {
        setComments(response.data.comments || []);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para enviar un comentario
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }
    
    if (!userName.trim()) {
      setError('El nombre de usuario no puede estar vacío');
      return;
    }
    
    // En la función handleSubmitComment
    try {
      setLoading(true);
      setError(null);
      
      const commentData = {
        nameUser: userName,
        content: commentText,
        publication: post._id
      };
      
      console.log('Enviando comentario:', commentData);
      
      try {
        const response = await commentService.createComment(commentData);
        console.log('Respuesta del servidor:', response);
        
        // Si llegamos aquí, consideramos que el comentario se guardó correctamente
        setCommentText('');
        setUserName('');
        setSuccess(true);
        
        // Recargar los comentarios
        try {
          const commentsResponse = await commentService.getCommentsByPublication(post._id);
          if (commentsResponse.data && commentsResponse.data.comments) {
            setComments(commentsResponse.data.comments);
          }
        } catch (refreshErr) {
          console.log('Error al recargar comentarios, pero el comentario se guardó');
        }
        
        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } catch (err) {
        console.error('Error al crear comentario:', err);
        
        // Verificar si el comentario se guardó a pesar del error
        try {
          // Esperar un momento para dar tiempo a que se guarde en la BD
          setTimeout(async () => {
            const commentsResponse = await commentService.getCommentsByPublication(post._id);
            if (commentsResponse.data && commentsResponse.data.comments) {
              // Verificar si hay un comentario nuevo con el mismo contenido
              const foundComment = commentsResponse.data.comments.find(
                c => c.content === commentText && c.nameUser === userName
              );
              
              if (foundComment) {
                // El comentario se guardó a pesar del error
                setComments(commentsResponse.data.comments);
                setCommentText('');
                setUserName('');
                setSuccess(true);
                setError(null);
                
                setTimeout(() => {
                  setSuccess(false);
                }, 3000);
              } else {
                setError('No se pudo publicar el comentario');
              }
            }
          }, 1000);
        } catch (refreshErr) {
          setError('No se pudo publicar el comentario');
        }
      }
    } catch (error) {
      console.error('Error general:', error);
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  // Función para alternar la visualización del formulario de comentarios
  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
    if (!showCommentForm) {
      setCommentText('');
      setError(null);
      setSuccess(false);
    }
  };

  // Mostrar el contenido completo en lugar de un extracto
  const content = post.description || post.content || 'Sin contenido';

  return (
    <Card className="mb-4 h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {formattedDate} | {courseName}
        </Card.Subtitle>
        <Card.Text>{content}</Card.Text>
        
        <div className="mt-auto">
          <Button 
            variant="primary" 
            onClick={toggleCommentForm}
            className="w-100"
          >
            {showCommentForm ? 'Ocultar comentarios' : 'Comentarios'}
          </Button>
        </div>
        
        {showCommentForm && (
          <div className="mt-3">
            <h5>Comentarios</h5>
            
            {loading && <p>Cargando comentarios...</p>}
            
            {comments.length > 0 ? (
              <div className="mb-3">
                {comments.map((comment, index) => (
                  <div key={comment._id || index} className="border-bottom mb-2 pb-2">
                    <div className="d-flex justify-content-between">
                      <strong>{comment.nameUser || 'Usuario anónimo'}</strong>
                      <small className="text-muted">
                        {comment.publicationDate ? new Date(comment.publicationDate).toLocaleDateString() : 'Fecha no disponible'}
                      </small>
                    </div>
                    <p className="mb-1">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
            )}
            
            <h6>Añadir un comentario</h6>
            
            {success && (
              <Alert variant="success" className="py-2">
                ¡Comentario publicado con éxito!
              </Alert>
            )}
            
            {error && (
              <Alert variant="danger" className="py-2">
                {error}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmitComment}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Tu nombre"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={loading}
                  maxLength={25}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Escribe tu comentario aquí..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={loading}
                  maxLength={200}
                  required
                />
              </Form.Group>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Publicar comentario'}
              </Button>
            </Form>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default PostCard;