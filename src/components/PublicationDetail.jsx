import React, { useState, useEffect } from 'react';
import { Card, Button, Form, ListGroup, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { publicationService, commentService } from '../services/api';

const PublicationDetail = () => {
  const { id } = useParams();
  const [publication, setPublication] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({
    nameUser: '',
    content: '',
    publication: '',
    publicationDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchPublicationAndComments = async () => {
      try {
        // En un caso real, deberíamos tener un endpoint para obtener una publicación por ID
        // Aquí simulamos con la fecha actual
        const today = new Date().toISOString().split('T')[0];
        const pubResponse = await publicationService.getPublicationsByDate(today);
        
        if (pubResponse.data.succes) {
          // Encontrar la publicación por ID
          const foundPublication = pubResponse.data.publications.find(pub => pub._id === id);
          if (foundPublication) {
            setPublication(foundPublication);
            
            // Cargar comentarios asociados a esta publicación
            const commentsResponse = await commentService.getCommentsByDate(today);
            if (commentsResponse.data.succes) {
              // Filtrar comentarios por publicación
              const relatedComments = commentsResponse.data.comments.filter(
                comment => comment.publication === foundPublication._id
              );
              setComments(relatedComments);
            }
          } else {
            setError('Publicación no encontrada');
          }
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos. Intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPublicationAndComments();
    }
  }, [id]);

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.nameUser.trim() || !newComment.content.trim()) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    try {
      // Preparar datos del comentario
      const commentData = {
        ...newComment,
        publication: publication.title, // Enviamos el título para que el backend lo asocie
        publicationDate: new Date().toISOString().split('T')[0]
      };
      
      const response = await commentService.createComment(commentData);
      
      if (response.data.succes) {
        // Añadir el nuevo comentario a la lista
        setComments(prev => [...prev, response.data.comment]);
        
        // Limpiar el formulario
        setNewComment({
          nameUser: '',
          content: '',
          publication: '',
          publicationDate: new Date().toISOString().split('T')[0]
        });
        
        setError(null);
      }
    } catch (err) {
      console.error('Error al enviar comentario:', err);
      setError('No se pudo enviar el comentario. Intente más tarde.');
    }
  };

  if (loading) return <p>Cargando publicación...</p>;
  if (error && !publication) return <Alert variant="danger">{error}</Alert>;
  if (!publication) return <Alert variant="warning">Publicación no encontrada</Alert>;

  return (
    <div className="publication-detail">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{publication.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {new Date(publication.creationDate).toLocaleDateString()}
          </Card.Subtitle>
          <Card.Text>{publication.description}</Card.Text>
        </Card.Body>
      </Card>

      <h3 className="mt-4 mb-3">Comentarios</h3>
      
      {comments.length > 0 ? (
        <ListGroup className="mb-4">
          {comments.map(comment => (
            <ListGroup.Item key={comment._id}>
              <div className="d-flex justify-content-between">
                <strong>{comment.nameUser}</strong>
                <small>{new Date(comment.publicationDate).toLocaleDateString()}</small>
              </div>
              <p className="mb-0 mt-2">{comment.content}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
      )}

      <h4 className="mb-3">Añadir un comentario</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmitComment}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nameUser"
            value={newComment.nameUser}
            onChange={handleCommentChange}
            placeholder="Tu nombre"
            maxLength={25}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Comentario</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            value={newComment.content}
            onChange={handleCommentChange}
            placeholder="Escribe tu comentario aquí"
            rows={3}
            maxLength={200}
            required
          />
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Enviar comentario
        </Button>
      </Form>
    </div>
  );
};

export default PublicationDetail;