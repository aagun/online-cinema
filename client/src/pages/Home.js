import React, { useState, lazy, Fragment } from 'react';
import { useInfiniteQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroller';

import { API } from '../config';
import FilmsLoading from '../components/skeletons/FilmsLoading';

const Navbar = lazy(() => import('../components/Navbar'));
const Banner = lazy(() => import('../components/Banner'));
const Films = lazy(() => import('../components/Films'));

const api = API();
const fetchFilm = async ({ pageParam = 1 }) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await api.get(`/films?page=${pageParam}`, config);
  return {
    films: response?.data?.films,
    nextPage: pageParam + 1,
    totalPage: response?.data?.totalPage,
  };
};

export default function Home() {
  document.title = 'Online Cinema';

  const [cart, setCart] = useState(false);
  const { data, isLoading, isSuccess, fetchNextPage, hasNextPage } = useInfiniteQuery('films', fetchFilm, {
    getNextPageParam: (lastPage, page) => (lastPage.nextPage < lastPage.totalPage ? lastPage.nextPage : undefined),
  });

  return (
    <Fragment>
      <Navbar cart={cart} setCart={setCart} />
      <Banner setCart={setCart} />
      {isLoading && <FilmsLoading />}
      {isSuccess && (
        <InfiniteScroll
          loadMore={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="loader" key={0}>
              <FilmsLoading />
            </div>
          }
        >
          <Films title="List Film" data={data} />
        </InfiniteScroll>
      )}
    </Fragment>
  );
}
