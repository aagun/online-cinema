/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react';
import { Container, Nav, Navbar, OverlayTrigger, Popover } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import Skeleton from 'react-loading-skeleton';
import { Image } from 'react-image-and-background-image-fade';

import { useUserContext } from '../context/userContext';
import logo from '../assets/logo.svg';
import iconMovie from '../assets/icons/movie.svg';
import iconLogout from '../assets/icons/logout.svg';
import iconUser from '../assets/icons/user.svg';
import iconTransaction from '../assets/icons/transactions.svg';
import defaultAvatar from '../assets/default-avatar.png';
import MenuItem from './MenuItem';
import Button from './Button';
import Auth from './modals/Auth';
import { API } from '../config';

const api = API();

const getUserAvatar = async () => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + localStorage.token,
    },
  };

  const response = await api.get('/u/avatar', config);
  return response.data;
};

const menuByRole = (role) => {
  return role === 'user' ? (
    <Fragment>
      <MenuItem icon={iconUser} width={30} to="/profile" replace>
        Profile
      </MenuItem>
      <MenuItem icon={iconMovie} width={28} to="/my-films" replace>
        My list Film
      </MenuItem>
    </Fragment>
  ) : (
    <Fragment>
      <MenuItem icon={iconTransaction} width={28} to="/transactions" replace>
        Transaction
      </MenuItem>
      <MenuItem icon={iconMovie} width={28} to="/add-film" replace>
        Add Film
      </MenuItem>
    </Fragment>
  );
};

const menu = (role, dispatch, navigate) => {
  const logout = () => {
    dispatch({
      type: 'LOGOUT',
    });

    navigate('/', { replace: true });
  };

  const MenuItems = menuByRole(role); // get menu by user role

  return (
    <Popover id="popover-basic">
      <Popover.Body className="text-white" style={{ width: '200px' }}>
        {/* render menu by user role */}
        {MenuItems}
        <hr />
        <MenuItem icon={iconLogout} width={30} onClick={logout} replace>
          Logout
        </MenuItem>
      </Popover.Body>
    </Popover>
  );
};

export default function NavbarSection({ cart, setCart }) {
  const [show, setShow] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [state, dispatch] = useUserContext();
  const navigate = useNavigate();

  const { refetch, isLoading } = useQuery('avatar', getUserAvatar, {
    enabled: !!localStorage.token,
    refetchOnMount: false,
    keepPreviousData: true,
    onSuccess: (item) => !!item.avatar && setAvatar(item.avatar),
  });

  const switchLogin = () => {
    setShow(true);
    setIsLoginModal(true);
  };

  const switchRegister = () => {
    setShow(true);
    setIsLoginModal(false);
  };

  useEffect(() => {
    if (cart && !state.isLogin) {
      setShow(true);
      setIsLoginModal(true);
    }

    if (state.isLogin) {
      refetch();
    }
  }, [cart, refetch]);

  const overlay = menu(state.user?.status, dispatch, navigate);

  return (
    <Fragment>
      <Navbar bg="default" variant="dark" className="py-5">
        <Container fluid="md">
          <Link to="/" replace>
            <img src={logo} alt="brand" />
          </Link>
          <Nav className="ms-auto">
            {state?.isLogin || !!localStorage.token ? (
              state?.isLogin && (
                <OverlayTrigger trigger="click" placement="bottom" rootClose overlay={overlay}>
                  {isLoading ? (
                    <Skeleton width={50} height={50} circle baseColor="#3b3b3b" highlightColor="#2a2a2c" />
                  ) : (
                    <div>
                      <Image
                        src={avatar}
                        isResponsive
                        lazyLoad
                        className="avatar rounded-circle"
                        renderLoader={() => (
                          <Skeleton width={50} height={50} circle baseColor="#3b3b3b" highlightColor="#2a2a2c" />
                        )}
                      />
                    </div>
                  )}
                </OverlayTrigger>
              )
            ) : (
              <Fragment>
                <Button className="btn-dark mx-1 text-white" onClick={switchLogin}>
                  Login
                </Button>
                <Button className="btn-primary mx-1 text-white" onClick={switchRegister}>
                  Register
                </Button>
              </Fragment>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Auth
        isLoginModal={isLoginModal}
        setIsLoginModal={setIsLoginModal}
        show={show}
        setShow={setShow}
        cart={cart}
        setCart={setCart}
      />
    </Fragment>
  );
}
