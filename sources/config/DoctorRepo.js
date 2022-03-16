import {client} from './baseRepo';

const getListDoctors = () => {
  return new Promise((resolve, reject) => {
    client
      .get('/doctors')
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

export {getListDoctors};
