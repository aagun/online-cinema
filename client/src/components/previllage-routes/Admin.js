import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';

export default function Admin() {
  const [state, ,] = useUserContext();
  const navigate = useNavigate();

  const isAdmin = state.user.status === 'admin' && state.isLogin;

  return <div>{isAdmin ? <Outlet /> : navigate(-1)}</div>;
}
