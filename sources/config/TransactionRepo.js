import {stringify} from 'query-string';
import {client} from './baseRepo';

const getTransactionList = () => {
  return new Promise((resolve, reject) => {
    client
      .get('/transactions')
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

const createTransaction = (data) => {
  return new Promise((resolve, reject) => {
    client
      .post('/transactions', stringify(data))
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

const getAppointmentList = () => {
  return new Promise((resolve, reject) => {
    client
      .get('/appointments')
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};
const updateTransaction = (id, status = 'finished') => {
  return new Promise((resolve, reject) => {
    client
      .put(`/transactions/${id}`, {transaction_status: status})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

const setRating = (data) => {
  return new Promise((resolve, reject) => {
    client
      .post('/ratings', stringify(data))
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

export {
  setRating,
  getTransactionList,
  getAppointmentList,
  createTransaction,
  updateTransaction,
};
