import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';

export default function Member() {
  const [state, ,] = useUserContext();
  const navigate = useNavigate();

  const isMember = state.user.status === 'user' && state.isLogin;

  return <div>{isMember ? <Outlet /> : navigate(-1)}</div>;
}
