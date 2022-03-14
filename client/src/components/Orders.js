import React, { useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroller';

import OrderItem from './OrderItem';
import OrdersLoading from '../components/skeletons/OrdersLoading';
import Order404 from './Order404';
import { API } from '../config';

const api = API();
const getOrderHistory = async ({ pageParam = 1 }) => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + localStorage.token,
    },
  };

  const { data } = await api.get(`/u/orders?page=${pageParam}`, config);
  return {
    ordersHistory: data?.transactions,
    nextPage: pageParam + 1,
    totalPage: data?.totalPage,
  };
};

export default function Order() {
  let scrollParentRef = useRef();
  const { data, isSuccess, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery('orderHistory', getOrderHistory, {
    getNextPageParam: (lastPage, page) => (lastPage.nextPage < lastPage.totalPage ? lastPage.nextPage : undefined),
  });

  return (
    <div className="col-md-6 ">
      <h3 className="text-white fw-bold">History Transaction</h3>
      <div className="orders" ref={(ref) => (scrollParentRef = ref)}>
        {isLoading && <OrdersLoading />}
        {isSuccess && data.pages[0].ordersHistory.length > 0 ? (
          <InfiniteScroll
            loadMore={fetchNextPage}
            hasMore={hasNextPage}
            useWindow={false}
            loader={
              <div className="loader" key={0}>
                <OrdersLoading />
              </div>
            }
          >
            {data?.pages.map(({ ordersHistory }) =>
              ordersHistory.map((order, index) => <OrderItem key={index} data={order} />)
            )}
          </InfiniteScroll>
        ) : (
          <Order404 />
        )}
      </div>
    </div>
  );
}
