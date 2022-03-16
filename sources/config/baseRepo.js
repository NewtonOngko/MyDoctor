import axios from 'axios';

// const baseLink = 'http://192.168.0.136:5000';
// const baseLink = 'http://192.168.1.7:5000';
const baseLink = 'https://doctornow-api.herokuapp.com';

export const client = axios.create({baseURL: baseLink});
