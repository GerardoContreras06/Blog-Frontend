import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { publicationService } from '../services/api';
import PostList from '../components/PostList';

function Home() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar todas las publicaciones
  const fetchPublications = async () => {
    try {
      setLoading(true);
      // Usar getPublications en lugar de getPublicationsByDate
      const response = await publicationService.getPublications();
      
      if (response.data && response.data.success) {
        // Nota: el controlador devuelve 'publication' (singular), no 'publications'
        setPublications(response.data.publication);
      } else {
        setError('Error al cargar las publicaciones');
      }
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
      setError('No se pudieron cargar las publicaciones. Intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Todos los Artículos</h2>
          <Button 
            variant="outline-primary" 
            className="float-end"
            onClick={fetchPublications}
          >
            Actualizar
          </Button>
          <hr />
        </Col>
      </Row>
      
      {loading ? (
        <p className="text-center">Cargando publicaciones...</p>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : publications && publications.length > 0 ? (
        <PostList posts={publications} />
      ) : (
        <Alert variant="info">No hay publicaciones disponibles.</Alert>
      )}
    </Container>
  );
}

export default Home;