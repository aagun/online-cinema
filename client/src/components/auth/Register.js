import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { Form } from 'react-bootstrap';
import Button from '../Button';
import { API } from '../../config';

export default function Register({ setIsLoginModal, setMessage }) {
  document.title = 'Online Cinema | Register';

  const api = API();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const { email, password, fullName } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      };

      const response = await api.post('/register', config);

      if (response.status === 'failed') {
        return setMessage({ response: response.error.message, variant: 'danger' });
      }

      // reset states
      setForm({
        email: '',
        password: '',
        fullName: '',
      });
      setIsLoginModal(true);
      setMessage({ response: 'Register success', variant: 'success' });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <Form onSubmit={(e) => handleSubmit.mutate(e)} method="POST">
      <Form.Group className="mb-3 border-secondary border-3" controlId="email">
        <Form.Control type="email" placeholder="Email" name="email" onChange={handleChange} value={email} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange} value={password} />
      </Form.Group>
      <Form.Control type="text" placeholder="Full Name" name="fullName" onChange={handleChange} value={fullName} />
      <Form.Group className="mb-3" controlId="fullName"></Form.Group>
      <Button type="submit" className="w-100 mt-4  btn-primary">
        Register
      </Button>
    </Form>
  );
}
