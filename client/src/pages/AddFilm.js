import React, { Fragment, useState } from 'react';
import { Container, Form, Col, Row, Alert } from 'react-bootstrap';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import attcahIcon from '../assets/icons/attach.svg';
import convertRupiah from 'rupiah-format';
import ReactHTMLDatalist from 'react-html-datalist';
import { useMutation, useQuery } from 'react-query';
import { API } from '../config';

let api = API();

const fetchCategories = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await api.get('/categories', config);
  return response.data;
};

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

  setMessage({
    response: 'Data berhasil ditambahkan',
    variant: 'success',
  });
  handleCloseMessage(setMessage);
};

const addFilm = async (data) => {
  const config = {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + localStorage.token,
    },
    body: data,
  };

  const response = await api.post('/film', config);
  return response;
};

export default function AddFilm() {
  document.title = 'Online Cinema | Add Film';

  const [previewBanner, setPreviewBanner] = useState('');
  const [previewThumbnail, setPreviewThumbnail] = useState('');
  const [formatedPrice, setFormatedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: '',
    price: '',
    linkFilm: '',
    description: '',
    thumbnail: '',
    banner: '',
  });
  const { title, category, price, linkFilm, description, thumbnail, banner } = form;

  const resetStates = () => {
    setForm({
      title: '',
      category: '',
      price: '',
      linkFilm: '',
      description: '',
      thumbnail: '',
    });
    setPreviewBanner('');
    setPreviewThumbnail('');
    setFormatedPrice('');
  };

  // queries
  let { data: categories, isSuccess } = useQuery('categoriesCache', fetchCategories);

  const previewImage = (input) => {
    const setPreview = {
      thumbnail: (url) => setPreviewThumbnail(url),
      banner: (url) => setPreviewBanner(url),
    };

    if (input.type === 'file') {
      const url = URL.createObjectURL(input.files[0]);
      setPreview[input.name](url);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value,
    });

    previewImage(e.target);
  };

  const handleFocus = () => {
    setFormatedPrice('');
  };

  // format price to idr curreny when onFoucusOut
  const handleBlur = () => {
    setFormatedPrice(convertRupiah.convert(price).split(',')[0]);
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();

      if (typeof thumbnail === 'object') {
        formData.set('thumbnail', thumbnail[0], thumbnail[0].name);
      }

      if (typeof banner === 'object') {
        formData.set('banner', banner[0], banner[0].name);
      }

      if (typeof banner !== 'object' || typeof thumbnail !== 'object') {
        setMessage({ response: 'Please attach an image', variant: 'danger' });
      }

      formData.set('title', title);
      formData.set('category', category);
      formData.set('price', price);
      formData.set('linkFilm', linkFilm);
      formData.set('description', description);

      const response = await addFilm(formData);
      handleMessage(response, setMessage);

      response.status === 'success' && resetStates();
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <Fragment>
      <Navbar />
      <Container className="mb-5">
        <h3 className="text-white fw-bold mb-5">Add Film</h3>
        <div>
          {previewBanner && (
            <div
              style={{
                height: 447,
                backgroundImage: `url(${previewBanner})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
                borderRadius: '8px',
                marginBottom: '2rem',
              }}
            ></div>
          )}
          <Row>
            {previewThumbnail && (
              <Col>
                <img src={previewThumbnail} alt="" className="img-preview" />
              </Col>
            )}
            <Col md={previewThumbnail ? 9 : 12}>
              {message && (
                <Alert variant={message.variant} dismissible onClick={() => setMessage('')}>
                  {message.response}
                </Alert>
              )}
              <Form onSubmit={(e) => handleSubmit.mutate(e)} enctype="multipart/form-data">
                {/* title and thumbnail */}
                <Row>
                  <Col md={9}>
                    <Form.Control
                      className="mb-4"
                      type="text"
                      placeholder="Title"
                      name="title"
                      value={title}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      className="mb-4"
                      type="file"
                      hidden
                      id="thumbnail"
                      name="thumbnail"
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="thumbnail"
                      className="btn btn-outline-secondary fw-bold w-100 d-flex justify-content-between align-items-center"
                    >
                      <span>Attach Thumbnail</span>
                      <img src={attcahIcon} alt="ic_attach" />
                    </label>
                  </Col>
                </Row>
                {/* banner */}
                <Form.Control type="file" hidden id="banner" name="banner" onChange={handleChange} />
                <label
                  htmlFor="banner"
                  className="mb-4 btn btn-outline-secondary fw-bold w-100 d-flex justify-content-between align-items-center"
                >
                  <span>Attach Banner</span>
                  <img src={attcahIcon} alt="ic_attach" />
                </label>

                {/* category */}
                <ReactHTMLDatalist
                  name="category"
                  onChange={handleChange}
                  classNames="form-control mb-1"
                  options={isSuccess ? [...categories] : []}
                />
                <p className="text-danger ms-2 fw-bold" style={{ fontSize: '.9rem' }}>
                  Harap hapus category sebelum input data baru
                </p>
                {/* price */}
                <Form.Control
                  className="mb-4 mt-2"
                  type="text"
                  placeholder="Price"
                  name="price"
                  value={formatedPrice ? formatedPrice : price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
                {/* link film */}
                <Form.Control
                  className="mb-4"
                  type="url"
                  placeholder="Link Film"
                  name="linkFilm"
                  value={linkFilm}
                  onChange={handleChange}
                />
                {/* description */}
                <Form.Control
                  className="mb-4"
                  as="textarea"
                  placeholder="Description"
                  style={{ height: '200px' }}
                  name="description"
                  value={description}
                  onChange={handleChange}
                />
                <Col className="d-flex justify-content-end">
                  <Button type="submit" className="btn-primary">
                    Add Film
                  </Button>
                </Col>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
}
