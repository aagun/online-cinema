import React from 'react';
import { Card } from 'react-bootstrap';

export default function OrderItem(props) {
  const { orderDay, orderDate, film, status } = props?.data;

  return (
    <Card className="order-item mt-3">
      <Card.Body>
        <Card.Text>
          <h4 className="mb-3 fw-bold">{film.title}</h4>
          <p>
            <strong>{orderDay}, </strong>
            <span>{orderDate} </span>
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <p className="text-mega fw-bold mb-0 pb-0" style={{ fontSize: 16 }}>
              {film.price}
            </p>
            <div className={`rounded-2 py-1 px-5 text-center ${status.toLowerCase()}`}>{status}</div>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
