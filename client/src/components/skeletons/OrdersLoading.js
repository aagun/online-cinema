import React, { Fragment } from 'react';
import { Col } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';

export default function OrdersLoading() {
  const loadLength = [...Array(6).keys()];
  return (
    <Fragment>
      {loadLength?.map((index) => (
        <Col key={index} className="mt-3">
          <Skeleton height={150} baseColor="#3b3b3b" highlightColor="#2a2a2c" borderRadius={4} />
        </Col>
      ))}
    </Fragment>
  );
}
