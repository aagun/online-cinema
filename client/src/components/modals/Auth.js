import React, { useState } from 'react';
import { Alert, Modal } from 'react-bootstrap';
import { Login, Register } from '../auth';

export default function Auth(props) {
  const { show, setShow, isLoginModal, setIsLoginModal, cart, setCart } = props;
  const [message, setMessage] = useState(null);

  const handleFormModal = () => {
    if (isLoginModal) {
      setMessage(null);
      return setIsLoginModal(false);
    }
    setIsLoginModal(true);
  };

  const handleClose = () => {
    setMessage(null);
    setShow(false);
    setCart(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header className="border-0">
        <Modal.Title className="text-mega">{isLoginModal ? 'Login' : 'Register'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-white">
        {message && <Alert variant={message?.variant}>{message?.response}</Alert>}
        {isLoginModal ? (
          <Login
            setIsLoginModal={setIsLoginModal}
            setMessage={setMessage}
            setShow={setShow}
            cart={cart}
            setCart={setCart}
          />
        ) : (
          <Register setIsLoginModal={setIsLoginModal} setMessage={setMessage} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="text-white mx-auto">
          <span>{isLoginModal ? "Don't have an account ? Klik " : 'Already have an account? Klik '}</span>
          <strong onClick={handleFormModal} style={{ cursor: 'pointer' }}>
            Here
          </strong>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
