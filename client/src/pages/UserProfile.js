import React, { Fragment, lazy } from 'react';
import { Container, Row } from 'react-bootstrap';

const Navbar = lazy(() => import('../components/Navbar'));
const Profile = lazy(() => import('../components/ProfileDetail'));
const Orders = lazy(() => import('../components/Orders'));

export default function UserProfile() {
  document.title = 'Online Cinema | Profile';

  return (
    <Fragment>
      <Navbar />
      <Container>
        <Row>
          <Profile />
          <Orders />
        </Row>
      </Container>
    </Fragment>
  );
}
