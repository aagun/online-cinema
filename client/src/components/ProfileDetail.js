import React, { Fragment, useState } from 'react';
import { useQuery } from 'react-query';
import { Col, Row } from 'react-bootstrap';

import Text from './Text';
import Label from './Label';
import defaultAvatar from '../assets/default-avatar.png';
import { API } from '../config';
import { Image } from 'react-image-and-background-image-fade';
import Skeleton from 'react-loading-skeleton';

const api = API();

const getUserProfile = async () => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + localStorage.token,
    },
  };

  const response = await api.get('/u/profile', config);
  return response?.data;
};

export default function ProfileDetail() {
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [phone, setPhone] = useState('-');

  const { data, isSuccess, isLoading } = useQuery('profile', getUserProfile, {
    onSuccess: ({ profile }) => {
      !!profile.avatar && setAvatar(profile.avatar);
      !!profile.phone && setPhone(profile.phone);
    },
  });

  return (
    <Fragment>
      <Col md={6}>
        <h3 className="text-white fw-bold mb-5">My Profile</h3>
        {isLoading && <div className="text-danger">Loading..</div>}
        {isSuccess && (
          <Row>
            <Col md={4} className="profile mb-4">
              <Image
                src={avatar}
                isResponsive
                lazyLoad
                className="profile-picture"
                renderLoader={() => <Skeleton width={350} height={300} baseColor="#3b3b3b" highlightColor="#2a2a2c" />}
              />
            </Col>
            <Col md={8} className="mb-5">
              <div className="mb-4">
                <Label>Full Name</Label>
                <Text>{data.fullName}</Text>
              </div>
              <div className="mb-4">
                <Label>Email</Label>
                <Text>{data.email}</Text>
              </div>
              <div>
                <Label>Phone</Label>
                <Text>{phone}</Text>
              </div>
            </Col>
          </Row>
        )}
      </Col>
    </Fragment>
  );
}
