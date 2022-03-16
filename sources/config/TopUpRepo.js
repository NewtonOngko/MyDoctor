import {stringify} from 'query-string';
import {client} from './baseRepo';

const topUp = (data) => {
  return new Promise((resolve, reject) => {
    client
      .post('/top-up', stringify(data))
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

const getAllTopUp = () => {
  return new Promise((resolve, reject) => {
    client
      .get('/top-up-detail')
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

export {topUp, getAllTopUp};
