import React from 'react';
import { Col } from 'react-bootstrap';

export default function ThumbnailFilm({ data }) {
  return (
    <Col md={4} className="p-0 rounded-3">
      <img src={data?.thumbnail} alt={`thumbnail - ${data?.title.split(' ').join('-')}`} className="thumbnail" />
    </Col>
  );
}
