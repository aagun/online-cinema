import React, { Fragment, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Container, OverlayTrigger, Popover, Table } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import dropIcon from '../assets/icons/drop.svg';
import { API } from '../config';

const api = API();

const getTransactions = async (page) => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + localStorage.token,
    },
  };

  const response = await api.get(`/transactions?page=${page}`, config);
  return response?.data;
};

const setColorDependsPaymentStatus = (paymentStatus) => {
  const colorSchema = {
    approved: 'text-success',
    cancel: 'text-danger',
    pending: 'text-warning',
  };

  return colorSchema[paymentStatus.toLowerCase()];
};

const changeAction = async ({ id, status }, page) => {
  const config = {
    method: 'PATCH',
    headers: {
      Authorization: 'Basic ' + localStorage.token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, status }),
  };

  await api.patch(`/transaction?page=${page}`, config);
};

export default function Transactions() {
  document.title = 'Online Cinema | Admin';

  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // get data transactions
  const { data, isSuccess } = useQuery(['transactions', page], () => getTransactions(page), {
    keepPreviousData: true,
  });

  // update transaction
  const handleAction = useMutation(({ id, status }) => changeAction({ id, status }, page), {
    onSuccess: async () => {
      queryClient.invalidateQueries(['transactions', page]);
    },
  });

  // pagination
  const nextPage = () => {
    setPage(page + 1);
  };

  const previousPage = () => {
    setPage(page - 1);
  };

  // handle render action menu
  const menu = (id) => {
    return (
      <Popover id="popover-basic">
        <Popover.Body className="text-white" style={{ width: '200px' }}>
          <div
            className={'text-success ps-4 py-3 fw-bold'}
            onClick={() => {
              handleAction.mutate({ id, status: 'approved' });
            }}
          >
            <span className="ms-3">Approve</span>
          </div>
          <div
            className={'text-danger ps-4 py-3 fw-bold'}
            onClick={() => {
              handleAction.mutate({ id, status: 'cancel' });
            }}
          >
            <span className="ms-3">Cancel</span>
          </div>
        </Popover.Body>
      </Popover>
    );
  };

  return (
    <Fragment>
      <Navbar />
      <Container>
        <h3 className="text-white fw-bold mb-5">Incoming Transaction</h3>
        <Table striped hover variant="dark" responsive="sm">
          <thead>
            <tr>
              <th>No</th>
              <th>Users</th>
              <th>Bukti Transaksi</th>
              <th>Film</th>
              <th>Account Number</th>
              <th>Payment Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {isSuccess &&
              data.transactions.map(({ id, accountNumber, transferProof, status, user, film }) => {
                const color = setColorDependsPaymentStatus(status);
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{user.fullName}</td>
                    <td>{transferProof}</td>
                    <td>{film.title}</td>
                    <td>{accountNumber}</td>
                    <td className={`fw-bold ${color}`}>{status}</td>
                    <td className="fw-bold text-center">
                      <OverlayTrigger trigger="click" placement="bottom" rootClose overlay={menu(id)}>
                        <img src={dropIcon} style={{ cursor: 'pointer' }} alt="ic_drop" />
                      </OverlayTrigger>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <div className="d-flex justify-content-end align-items-center w-100 mb-5">
          <button className="btn btn-primary" disabled={page === 1} onClick={previousPage}>
            Prev
          </button>
          <p className="mx-3 my-auto fw-bold text-white">{page}</p>
          <button className="btn btn-primary" disabled={page === data?.totalPage} onClick={nextPage}>
            Next
          </button>
        </div>
      </Container>
    </Fragment>
  );
}
