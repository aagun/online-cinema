import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import OrderNotFound from '../assets/no-order.svg';
import Button from './Button';

export default function Order404({ className }) {
  const navigate = useNavigate();
  return (
    <Col className={`d-flex flex-column justify-content-center align-items-center ${className}`}>
      <img className="order-not-found " src={OrderNotFound} alt="no_order_history" />
      <h2 className="my-3 text-mega">Let's make your frist order</h2>
      <Button className="btn-primary rounded-pill" onClick={() => navigate('/', { replace: true })}>
        Buy film
      </Button>
    </Col>
  );
}
