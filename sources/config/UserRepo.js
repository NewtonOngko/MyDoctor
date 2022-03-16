import {stringify} from 'query-string';
import {client} from './baseRepo';

const getAllUser = () => {
  return new Promise((resolve, reject) => {
    client
      .get('/users')
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};
const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    client
      .post('/login', {
        email: email,
        password: password,
      })
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

const registerUser = (data) => {
  return new Promise((resolve, reject) => {
    client
      .post('/users', stringify(data))
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

const getUser = (userId) => {
  return new Promise((resolve, reject) => {
    client
      .get(`/users/${userId}`, {})
      .then((res) => resolve(res.data[0]))
      .catch((err) => reject(err.response));
  });
};

const updateUser = (userId, data) => {
  return new Promise((resolve, reject) => {
    client
      .put(`/users/${userId}`, stringify(data))
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

const changePassword = (userId, newPassword) => {
  return new Promise((resolve, reject) => {
    client
      .patch(`/change-password/user/${userId}`, {password: newPassword})
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

export {
  loginUser,
  registerUser,
  getAllUser,
  getUser,
  changePassword,
  updateUser,
};
