import firebase from 'firebase';

firebase.initializeApp({
  apiKey: 'AIzaSyDnYRV8HLZIXzGHk1XDGQ7-LQiEnJzNOoU',
  authDomain: 'mydoctor-94.firebaseapp.com',
  databaseURL: 'https://mydoctor-94.firebaseio.com',
  projectId: 'mydoctor-94',
  storageBucket: 'mydoctor-94.appspot.com',
  messagingSenderId: '280095788079',
  appId: '1:280095788079:web:125bf2b550193c893ecada',
});

const FBase = firebase;
export default FBase;

export var FBaseStorage = firebase.storage();
