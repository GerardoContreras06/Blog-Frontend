import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { publicationService, commentService } from '../services/api';

function Comments() {
  const { id } = useParams();
  const [publication, setPublication] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [commentSuccess, setCommentSuccess] = useState(false);
  
  // Estados para edición de comentarios
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estado para confirmación de eliminación
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Cargar la publicación y sus comentarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Aquí deberías tener un endpoint para obtener una publicación por ID
        const publicationResponse = await publicationService.getPublicationById(id);
        
        if (publicationResponse.data && publicationResponse.data.success) {
          setPublication(publicationResponse.data.publication);
          
          // Cargar comentarios de la publicación
          const commentsResponse = await commentService.getCommentsByPublication(id);
          
          if (commentsResponse.data && commentsResponse.data.success) {
            setComments(commentsResponse.data.comments);
            console.log('Comentarios cargados:', comments);
          }
        } else {
          setError('No se pudo cargar la publicación');
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar la publicación y comentarios');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Manejar el envío de un nuevo comentario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setCommentError('El comentario no puede estar vacío');
      return;
    }
    
    if (!userName.trim()) {
      setCommentError('El nombre de usuario no puede estar vacío');
      return;
    }
    
    const commentData = {
      nameUser: userName,
      content: newComment,
      publication: id
    };
    
    console.log('Datos a enviar:', commentData);
    
    try {
      const response = await commentService.createComment(commentData);
      console.log('Respuesta del servidor:', response);
      
      // Consideramos que el comentario se guardó correctamente si tenemos una respuesta
      // incluso si no tiene el formato esperado
      if (response && response.data) {
        // Añadir el nuevo comentario a la lista
        // Si response.data.comment existe, usamos ese, de lo contrario creamos un objeto temporal
        const newCommentObj = response.data.comment || {
          _id: new Date().getTime(), // ID temporal
          nameUser: userName,
          content: newComment,
          publicationDate: new Date(),
          publication: id
        };
        
        setComments([...comments, newCommentObj]);
        setNewComment('');
        setUserName('');
        setCommentSuccess(true);
        setCommentError(null);
        
        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setCommentSuccess(false);
        }, 3000);
        
        // Recargar los comentarios para asegurarnos de tener la lista actualizada
        try {
          const refreshResponse = await commentService.getCommentsByPublication(id);
          if (refreshResponse.data && refreshResponse.data.comments) {
            setComments(refreshResponse.data.comments);
          }
        } catch (refreshErr) {
          console.log('Error al actualizar comentarios, pero el comentario se guardó correctamente');
        }
      } else {
        setCommentError('Error al publicar el comentario');
      }
    } catch (err) {
      console.error('Error detallado:', err.response?.data || err.message);
      
      // Si el comentario se guardó pero hubo un error al obtener la respuesta
      // Intentamos recargar los comentarios de todas formas
      try {
        const refreshResponse = await commentService.getCommentsByPublication(id);
        if (refreshResponse.data && refreshResponse.data.comments) {
          setComments(refreshResponse.data.comments);
          setNewComment('');
          setUserName('');
          setCommentSuccess(true);
          setCommentError(null);
          
          setTimeout(() => {
            setCommentSuccess(false);
          }, 3000);
        } else {
          setCommentError(`No se pudo publicar el comentario: ${err.response?.data?.message || err.message}`);
        }
      } catch (refreshErr) {
        setCommentError(`No se pudo publicar el comentario: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  // Función para abrir el modal de edición
  const handleEditClick = (comment) => {
    setEditingComment(comment);
    setEditCommentContent(comment.content);
    setShowEditModal(true);
  };
  
  // Función para guardar el comentario editado
  const handleSaveEdit = async () => {
    if (!editCommentContent.trim()) {
      setCommentError('El comentario no puede estar vacío');
      return;
    }
    
    try {
      const updatedComment = {
        ...editingComment,
        content: editCommentContent
      };
      
      const response = await commentService.updateComment(editingComment._id, updatedComment);
      
      if (response && response.data) {
        // Actualizar el comentario en la lista
        const updatedComments = comments.map(comment => 
          comment._id === editingComment._id 
            ? {...comment, content: editCommentContent} 
            : comment
        );
        
        setComments(updatedComments);
        setShowEditModal(false);
        setCommentSuccess(true);
        
        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setCommentSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error al actualizar comentario:', err);
      setCommentError('Error al actualizar el comentario');
    }
  };
  
  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };
  
  // Función para eliminar el comentario
  const handleConfirmDelete = async () => {
    try {
      const response = await commentService.deleteComment(commentToDelete._id);
      
      if (response && response.data) {
        // Eliminar el comentario de la lista
        const filteredComments = comments.filter(comment => comment._id !== commentToDelete._id);
        setComments(filteredComments);
        setShowDeleteModal(false);
        setCommentSuccess(true);
        
        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setCommentSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error al eliminar comentario:', err);
      setCommentError('Error al eliminar el comentario');
    }
  };

  if (loading) {
    return (
      <Container className="my-4">
        <p className="text-center">Cargando...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <Link to="/" className="btn btn-outline-secondary mb-3">
            &larr; Volver al inicio
          </Link>
          
          {publication && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{publication.title}</Card.Title>
                <Card.Text>{publication.description || publication.content}</Card.Text>
              </Card.Body>
            </Card>
          )}
          
          <h3 className="mb-3">Comentarios</h3>
          
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Card key={comment._id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="text-primary">{comment.nameUser || 'Usuario anónimo'}</strong>
                    <small className="text-muted">
                      {comment.publicationDate || comment.createdAt || comment.creationDate 
                        ? new Date(comment.publicationDate || comment.createdAt || comment.creationDate).toLocaleDateString() 
                        : 'Fecha reciente'}
                    </small>
                  </div>
                  <Card.Text>{comment.content}</Card.Text>
                  <hr />
                  <div className="d-flex justify-content-end">
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEditClick(comment)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteClick(comment)}
                    >
                      Eliminar
                    </button>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          )}
          
          <h4 className="mt-4">Añadir un comentario</h4>
          
          {commentSuccess && (
            <Alert variant="success">¡Operación realizada con éxito!</Alert>
          )}
          
          {commentError && (
            <Alert variant="danger">{commentError}</Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                maxLength={25}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Escribe tu comentario aquí..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={200}
                required
              />
              <Form.Text className="text-muted">
                Máximo 200 caracteres
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Publicar comentario
            </Button>
          </Form>
          
          {/* Modal para editar comentario */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Editar comentario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Contenido del comentario</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                  maxLength={200}
                />
                <Form.Text className="text-muted">
                  Máximo 200 caracteres
                </Form.Text>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Guardar cambios
              </Button>
            </Modal.Footer>
          </Modal>
          
          {/* Modal para confirmar eliminación */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}

export default Comments;