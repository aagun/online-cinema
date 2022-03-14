import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { useUserContext } from './context/userContext';
import { API } from './config';
import Loading from './components/Loading';

// Splitting renderring
const Home = lazy(() => import('./pages/Home'));
const DetailFilm = lazy(() => import('./pages/DetailFilm'));
const UserFilms = lazy(() => import('./pages/UserFilms'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Transactions = lazy(() => import('./pages/Transactions'));
const AddFilm = lazy(() => import('./pages/AddFilm'));
const Member = lazy(() => import('./components/previllage-routes/Member'));
const Admin = lazy(() => import('./components/previllage-routes/Admin'));
const NotFound = lazy(() => import('./components/404'));

function App() {
  document.title = 'Online Cinema';

  const api = API();
  const [state, dispatch] = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;

    if (!state.user.isLogin) {
      return;
    }

    if (state.user.status === 'admin') {
      return navigate(path, { replace: true });
    }

    if (state.user.status === 'user') {
      return navigate(path, { replace: true });
    }
  }, [state, navigate]);

  const checkAuth = async () => {
    try {
      const config = {
        method: 'GET',
        headers: {
          Authorization: 'Basic ' + localStorage.token,
        },
      };

      const response = await api.get('/check-auth', config);

      if (response.status === 'failed') {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }

      const data = {
        ...response?.data?.user,
        token: localStorage.token,
      };

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film/:title" element={<DetailFilm />} />

        {/* Previllage routes for member */}
        <Route element={<Member />}>
          <Route path="/my-films" element={<UserFilms />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* Previllage routes for admin */}
        <Route element={<Admin />}>
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/add-film" element={<AddFilm />} />
        </Route>

        {/* Route not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
