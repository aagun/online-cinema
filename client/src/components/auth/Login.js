import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Form } from 'react-bootstrap';
import Button from '../Button';
import { API } from '../../config';
import { useUserContext } from '../../context/userContext';

export default function Login({ setMessage, setShow, cart, setCart }) {
  document.title = 'Online Cinema | Login';

  const api = API();
  const navigate = useNavigate();
  const [, dispatch] = useUserContext();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const { email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setForm({
      email: '',
      password: '',
    });
    setMessage(null);
    setShow(false);
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

      const response = await api.post('/login', config);

      if (response.status === 'failed') {
        return setMessage({ response: response.error.message, variant: 'danger' });
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data.user,
      });

      if (response.data.user.status === 'admin') {
        handleReset();
        return navigate('/transactions', { replace: true });
      }

      handleReset();

      // if chart exist will redirect to detail film
      if (cart) {
        const film = JSON.parse(localStorage.cart);
        const path = film.title.split(' ').join('-');

        setCart(false);
        navigate(`/film/${path}`, { replace: true });

        return localStorage.removeItem('cart');
      }

      navigate('/', { replace: true });
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
      <Button type="submit" className="w-100 mt-4  btn-primary">
        Login
      </Button>
    </Form>
  );
}
