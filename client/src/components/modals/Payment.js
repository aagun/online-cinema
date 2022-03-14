import React, { Fragment, useState } from 'react';
import { Alert, Form, Modal } from 'react-bootstrap';
import { useMutation } from 'react-query';

import Button from '../Button';
import IconAttcahPayment from '../../assets/icons/attach-payment.svg';
import { API } from '../../config';
import Msg from './Message';

const api = API();

const handleCloseMessage = (setMessage) => {
  setTimeout(() => {
    setMessage('');
  }, 15000);
};

const handleMessage = (response, setMessage) => {
  if (response.status === 'failed') {
    setMessage({ response: response.error.message, variant: 'danger' });
    return handleCloseMessage(setMessage);
  }
};

const resetStates = (setForm, setPreview) => {
  setForm({
    accountNumber: '',
    transferProof: '',
  });

  setPreview('');
};

const buyFilm = async (data) => {
  const filmId = localStorage.filmId;
  const config = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + localStorage.token,
    },
    body: data,
  };

  const response = await api.post(`/transaction/film/${filmId}`, config);
  return response;
};

export default function Payment({ show, setShow, data, transactionId, refetch }) {
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState('');
  const [info, setInfo] = useState({});
  const [form, setForm] = useState({
    accountNumber: '',
    transferProof: '',
  });
  const { accountNumber, transferProof } = form;

  const previewImage = (input) => {
    if (input.type === 'file') {
      const filename = input.files[0].name;
      setPreview(filename);
    }
  };

  const handleClose = () => {
    resetStates(setForm, setPreview);
    setShow(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value,
    });
    previewImage(e.target);
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();

      formData.set('accountNumber', accountNumber);

      if (typeof transferProof === 'object') {
        formData.set('transferProof', transferProof[0], transferProof[0].name);
      } else {
        setMessage({ response: 'Please attach transfer proof', variant: 'danger' });
      }

      const response = await buyFilm(formData);
      handleMessage(response, setMessage);

      if (response.status === 'success') {
        setInfo({
          show: true,
          message: 'thank you for buying this film, please wait 1x24 hours because your transaction is in process',
        });
        handleClose();
        refetch();
      }
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <Fragment>
      <Modal className="payment" show={show} onHide={handleClose} centered>
        <Modal.Header className="border-0">
          <Modal.Title className="text-white d-flex justify-content-center w-100 mt-3">
            <h3 className="fw-bold mb-0 pb-0">
              Cinema<span className="text-mega">Online{'\xa0'}</span>
            </h3>
            <h3 className="fw-bold mb-0 pb-0 text-white">: {transactionId}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-white">
          <h3 className="fw-bold mb-3">{data?.title}</h3>
          <h5 className="fw-bold mb-4">
            Total: <span className="text-mega ">{data?.price}</span>
          </h5>
          {message && (
            <Alert variant={message.variant} dismissible onClick={() => setMessage('')}>
              {message.response}
            </Alert>
          )}
          <Form onSubmit={(e) => handleSubmit.mutate(e)}>
            <Form.Control
              type="text"
              placeholder="Input Your Account Number"
              name="accountNumber"
              value={accountNumber}
              onChange={handleChange}
            />
            <div className="d-flex justify-content-between mt-4">
              <Form.Control
                className="mb-4"
                type="file"
                hidden
                id="transferProof"
                name="transferProof"
                onChange={handleChange}
              />
              <label
                htmlFor="transferProof"
                className="btn btn-primary btn-payment py-2 fw-bold d-flex justify-content-between align-items-center"
              >
                <span className="me-1"> Attach Payment</span>
                <img src={IconAttcahPayment} alt="" />
              </label>

              <p className="text-muted mb-0 me-1 text-center align-self-center" style={{ fontSize: '13px' }}>
                *transfers can be made to holyways accounts
                {preview && (
                  <label className="fw-bold d-flex justify-content-between align-items-center">{preview}</label>
                )}
              </p>
            </div>
            <Button type="submit" className="w-100 mt-4  btn-primary btn-payment">
              Pay
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {info && <Msg info={info} setInfo={setInfo} />}
    </Fragment>
  );
}
