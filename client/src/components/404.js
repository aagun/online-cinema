import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NotFoundImage from '../assets/notfound.svg';
import Button from './Button';

export default function NotFound() {
  document.title = '404 Page not found!';

  const navigate = useNavigate();
  return (
    <Container>
      <Row>
        <Col className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ height: '80vh' }}>
          <img src={NotFoundImage} alt="404_error" className="page-not-found mb-4" />
          <p className="text-mega fw-bold mb-0">404 ERROR</p>
          <h1 className="text-mega fw-bold mt-1">Page not found.</h1>
          <h6 className="text-white fw-light">sorry, we couldn't find the page you're looking for.</h6>
          <Button className="btn-primary rounded-pill mt-4" onClick={() => navigate('/', { replace: true })}>
            Go back home
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
