/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, lazy, Suspense, useState } from 'react';
import { useQuery } from 'react-query';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../config';
import Loading from '../components/Loading';

const Navbar = lazy(() => import('../components/Navbar'));
const ThumbnailFilm = lazy(() => import('../components/detail-film/Thumbnail'));
const Header = lazy(() => import('../components/detail-film/Header'));
const VideoPlayer = lazy(() => import('../components/VideoPlayer'));
const Description = lazy(() => import('../components/detail-film/Description'));
const Payment = lazy(() => import('../components/modals/Payment'));

const api = API();

const getFilmGeneral = async (filmId) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await api.get(`/g/film/${filmId}`, config);
  return response?.data.film;
};

const getFilmMember = async () => {
  const { filmId } = localStorage;
  const config = {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + localStorage.token,
    },
  };
  const response = await api.get(`/u/film/${filmId}`, config);
  return response?.data?.film;
};

const capitalizeText = (value) => {
  let title = value.split('-');

  const capTitle = title.map((str) => str.charAt(0).toUpperCase() + str.slice(1));
  return capTitle.join(' ');
};

export default function DetailFilm() {
  const { title } = useParams();
  document.title = 'Online Cinema | ' + capitalizeText(title);

  const [show, setShow] = useState(false);
  const [cart, setCart] = useState(false);
  const [open, setOpen] = useState('');

  const {
    data: dataGeneral,
    isSuccess: gLoaded,
    remove: gRemove,
    refetch: gRefetch,
  } = useQuery('detailFilmCache', () => getFilmGeneral(localStorage?.filmId), {
    enabled: !localStorage.token,
    refetchOnMount: 'always',
  });

  const {
    data: dataMember,
    isSuccess: mLoaded,
    remove: mRemove,
    refetch: mRefetch,
  } = useQuery('detailFilmMemberCache', getFilmMember, {
    enabled: !!localStorage.token,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    return () => {
      gRemove();
      mRemove();
    };
  }, []);

  const data = {
    film: () => (dataMember ? dataMember : dataGeneral),
    banner: () => (dataMember ? dataMember?.banner : dataGeneral?.banner),
    doRefetch: () => (dataMember ? mRefetch : gRefetch),
  };

  return (
    <Suspense fallback={<Loading />}>
      <Navbar cart={cart} setCart={setCart} />
      {mLoaded || gLoaded ? (
        <Fragment>
          <Container>
            <Row>
              <ThumbnailFilm data={data.film()} />
              <Col md={8} className="p-0">
                <Row className="film mb-4 g-4">
                  <Header setShow={setShow} cart={cart} setCart={setCart} data={data.film()} setOpen={setOpen} />
                  {/* Video will exist when user already bought it */}
                  {dataMember?.url ? (
                    <VideoPlayer data={dataMember} open={open} setOpen={setOpen} />
                  ) : (
                    <img src={data.banner()} alt="film" className="cover" />
                  )}
                </Row>
                <Description data={data.film()} />
              </Col>
            </Row>
          </Container>

          <Payment
            show={show}
            setShow={setShow}
            data={dataMember ? dataMember : dataGeneral}
            transactionId={dataMember ? dataMember.transactionId : dataGeneral.transactionId}
            refetch={data.doRefetch()}
          />
        </Fragment>
      ) : (
        <Loading />
      )}
    </Suspense>
  );
}
