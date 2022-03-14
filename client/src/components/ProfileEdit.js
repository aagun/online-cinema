import React, { Fragment } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import zayn from '../assets/zayn.png';

export default function ProfileEdit() {
  return (
    <Fragment>
      <h3 className="text-white fw-bold mb-5">Edit My Profile</h3>
      <Row>
        <Col md={4}>
          <img src={zayn} alt="username" className="profile-picture" />
        </Col>
        <Col md={8}>
          <Form.Group className="mb-4">
            <Form.Control type="file" id="upload" name="image" hidden />
            <label htmlFor="upload" className="py-2 btn btn-primary fw-bold">
              Upload Photos
            </label>
          </Form.Group>
          <Form.Group className="mb-4" controlId="fullName">
            <Form.Control
              className="py-2"
              type="text"
              placeholder="Full Name"
              name="fullName"
              // onChange={handleChange}
              // value={form.password}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="email">
            <Form.Control
              className="py-2"
              type="email"
              placeholder="Email"
              name="email"
              // onChange={handleChange}
              // value={form.password}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Control
              className="py-2"
              type="text"
              placeholder="Phone"
              name="phone"
              // onChange={handleChange}
              // value={form.password}
            />
          </Form.Group>
        </Col>
      </Row>
    </Fragment>
  );
}
