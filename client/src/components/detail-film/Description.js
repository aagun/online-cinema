import React from 'react';
import { Row } from 'react-bootstrap';

export default function Description({ data }) {
  const { category, status, price, description } = data;

  const hasFilm = () => {
    return status === 'approved' ? 'Owned' : price;
  };

  return (
    <Row className="film-content">
      <h4 className="fw-bold text-muted mb-3">{category}</h4>
      <p className="price fw-bold text-mega mb-4">{hasFilm()}</p>
      <p className="description text-white fw-light">{description}</p>
    </Row>
  );
}
