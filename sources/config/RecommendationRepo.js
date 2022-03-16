import {stringify} from 'query-string';
import {client} from './baseRepo';

const getRecomendations = () => {
  return new Promise((resolve, reject) => {
    client
      .get('/recommendations')
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

const setDistance = (data) => {
  return new Promise((resolve, reject) => {
    client
      .post('/distance', stringify(data))
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

export {getRecomendations, setDistance};
