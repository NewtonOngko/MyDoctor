import axios from 'axios';
import {client} from './baseRepo';

const getNews = () => {
  return new Promise((resolve, reject) => {
    client
      .get('/news')
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

const getNewsDetail = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .create({
        baseURL: 'https://us-central1-technews-251304.cloudfunctions.net',
      })
      .get(`/article-parser?url=${url.toString()}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
};

export {getNews, getNewsDetail};
