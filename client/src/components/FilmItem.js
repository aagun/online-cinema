import React from 'react';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Image } from 'react-image-and-background-image-fade';
import Skeleton from 'react-loading-skeleton';

const handleClick = (filmId) => {
  localStorage.setItem('filmId', filmId);
};

const convertFilmName = (name) => {
  return name.toLowerCase().split(' ').join('-');
};

export default function FilmItem({ data }) {
  const { id, title, thumbnail } = data;
  const filmName = convertFilmName(title);

  return (
    <Col className="pstr mb-4 py-2" style={{ height: 295 }} key={id}>
      <Link to={'/film/' + filmName}>
        <Image
          src={thumbnail}
          onClick={() => handleClick(id)}
          renderLoader={() => (
            <Col className="mb-4 py-1" style={{ height: 295 }}>
              <Skeleton height={280} baseColor="#3b3b3b" highlightColor="#2a2a2c" borderRadius={10} />
            </Col>
          )}
        />
      </Link>
    </Col>
  );
}
