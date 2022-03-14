import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BackgroundImage } from 'react-image-and-background-image-fade';

import { API } from '../config';
import { useUserContext } from '../context/userContext';
import Button from './Button';
import Skeleton from 'react-loading-skeleton';

const api = API();

const getFilmBannerForMember = async () => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.token,
    },
  };

  const response = await api.get('/u/banner', config);
  return response?.data?.banner;
};

const getFilmBannerForNonMember = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await api.get('/g/banner', config);
  return response?.data.banner;
};

const convertFilmName = (name) => {
  return name.toLowerCase().split(' ').join('-');
};

export default function Banner({ setCart }) {
  const navigate = useNavigate();
  const [state] = useUserContext();
  const [loadBanner, setLoadBanner] = useState(true);
  const [data, setData] = useState({});

  // banner for member
  const { data: dataMBanner, isSuccess: mSuccess } = useQuery('bannerCache', getFilmBannerForMember, {
    enabled: !!localStorage.token,
  });

  // banner for non member
  const { data: dataGBanner, isSuccess: gSuccess } = useQuery('gBannerCache', getFilmBannerForNonMember, {
    enabled: !localStorage.token,
  });

  useEffect(() => {
    if (mSuccess && localStorage.token) {
      setData(dataMBanner);
      return setLoadBanner(false);
    }

    if (gSuccess) {
      setData(dataGBanner);
      return setLoadBanner(false);
    }
  }, [gSuccess, mSuccess]);

  const buyFilm = () => {
    if (!state.isLogin) {
      setCart(true);
      return localStorage.setItem('cart', JSON.stringify(data));
    }
    const filmName = convertFilmName(data.title);
    localStorage.setItem('filmId', data.id);
    navigate(`/film/${filmName}`);
  };

  return (
    <Container className="mb-5 d-flex justify-content-center align-items-center">
      {loadBanner && (
        <Row style={{ width: '85%', minHeight: '447px' }}>
          <Col>
            <Skeleton height={447} baseColor="#3b3b3b" highlightColor="#2a2a2c" />
          </Col>
        </Row>
      )}
      {!loadBanner && (
        <Row style={{ width: '85%', minHeight: '447px' }}>
          <Col className="banner d-flex justify-content-center align-items-center">
            <BackgroundImage
              src={data.banner}
              lazyLoad
              isResponsive
              className="banner"
              renderLoader={() => <Skeleton height={447} baseColor="#3b3b3b" highlightColor="#2a2a2c" />}
            >
              <div className="banner-filter"></div>
              <div className="banner-contents">
                <h1 className="banner-title fw-bold">{data.title}</h1>
                <h5 className="fw-bold text-white">{data.category}</h5>
                <h5 className="fw-bold text-mega mb-3">{data.price}</h5>
                <p className="banner-description text-white">{data.description}</p>
                {!data?.status && (
                  <Button className="btn-primary" onClick={() => buyFilm()}>
                    Buy now
                  </Button>
                )}
                {data?.status === 'approved' && (
                  <Button className="btn-info" onClick={() => buyFilm()}>
                    Watch now
                  </Button>
                )}
                {data?.status === 'pending' && (
                  <Button className="btn-warning" onClick={() => buyFilm()}>
                    Pending
                  </Button>
                )}
              </div>
            </BackgroundImage>
          </Col>
        </Row>
      )}
    </Container>
  );
}
