import React from 'react';
import { Modal } from 'react-bootstrap';

export default function Msg({ info, setInfo }) {
  const handleClose = () => {
    setInfo({});
  };

  return (
    <Modal className="info" show={info.show} onHide={handleClose} centered>
      <Modal.Body className="text-success">{info.message}</Modal.Body>
    </Modal>
  );
}
