import {client} from './baseRepo';

const getListHospitals = () => {
  return new Promise((resolve, reject) => {
    client
      .get('/hospitals')
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

export {getListHospitals};
