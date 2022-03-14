import React, { lazy, Suspense } from 'react';
import { useInfiniteQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroller';

import FilmsLoading from '../components/skeletons/FilmsLoading';
import { API } from '../config';

const Navbar = lazy(() => import('../components/Navbar'));
const Films = lazy(() => import('../components/Films'));
const Order404 = lazy(() => import('../components/Order404'));

const api = API();

const getFilms = async ({ pageParam = 1 }) => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.token,
    },
  };

  const response = await api.get(`/u/films?page=${pageParam}`, config);
  return {
    films: response?.data.films,
    nextPage: pageParam + 1,
    totalPage: response?.data.totalPage,
  };
};

export default function UserFilms() {
  document.title = 'Online Cinema | My Films';

  const { data, isSuccess, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery('myFilms', getFilms, {
    getNextPageParam: (lastPage, page) => (lastPage.nextPage < lastPage.totalPage ? lastPage.nextPage : undefined),
  });

  console.log('data', data);

  return (
    <Suspense>
      <Navbar />
      {isLoading && <FilmsLoading />}
      {isSuccess && data.pages[0].films.length > 0 ? (
        <InfiniteScroll
          loadMore={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="loader" key={0}>
              <FilmsLoading />
            </div>
          }
        >
          <Films title="My Films" data={data} />
        </InfiniteScroll>
      ) : (
        <Order404 className="w-50 mx-auto mt-5" />
      )}
    </Suspense>
  );
}
