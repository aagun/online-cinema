import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';

export default function FilmsLoading() {
  const loadLength = [...Array(6).keys()];
  return (
    <Container>
      <Row className="d-flex flex-wrap row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6">
        {loadLength?.map((index) => (
          <Col key={index} className="mb-4 py-1" style={{ height: 295 }}>
            <Skeleton height={280} baseColor="#3b3b3b" highlightColor="#2a2a2c" borderRadius={10} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
