import React from 'react';
import { Container, Row } from 'react-bootstrap';

import FilmItem from './FilmItem';

export default function Films({ title, data }) {
  return (
    <Container>
      <h5 className="fw-bold text-white mb-4">{title}</h5>
      <Row className="d-flex flex-wrap row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6">
        {data?.pages.map(({ films }) => films.map((film, index) => <FilmItem data={film} key={index} />))}
      </Row>
    </Container>
  );
}
