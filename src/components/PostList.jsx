import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PostCard from './PostCard';

function PostList({ posts = [] }) {
  // Si no hay posts, mostrar mensaje
  if (posts.length === 0) {
    return <p className="text-center">No hay publicaciones disponibles.</p>;
  }

  return (
    <Row>
      {posts.map(post => (
        <Col md={4} className="mb-4" key={post._id}>
          <PostCard post={post} />
        </Col>
      ))}
    </Row>
  );
}

export default PostList;