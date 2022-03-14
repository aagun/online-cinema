import React, { Fragment } from 'react';
import { Col } from 'react-bootstrap';
import { useUserContext } from '../../context/userContext';
import Button from '../Button';

export default function Header({ setShow, setCart, data, setOpen }) {
  const [state] = useUserContext();

  const buyFilm = () => {
    if (!state.isLogin) {
      setCart(true);
      return localStorage.setItem('cart', JSON.stringify(data));
    }
    setCart(false);
    setShow(true);
  };

  return (
    <Fragment>
      <Col md={10} className="d-flex justify-content-between align-items-center">
        <h1 className="title text-white fw-bold me-2">{data?.title}</h1>
      </Col>
      <Col className="d-flex justify-content-between align-items-center">
        {data.status === 'approved' && (
          <Button
            className={`btn-primary my-4`}
            onClick={() => setOpen({ video: 'open', autoPlay: '&amp;autoplay=1' })}
          >
            Watch
          </Button>
        )}
        {data.status === 'pending' && <Button className={`btn-warning my-4 disabled`}>Pending</Button>}
        {!data.status && (
          <Button className="btn-primary my-4" onClick={() => buyFilm()}>
            Buy now
          </Button>
        )}
      </Col>
    </Fragment>
  );
}
