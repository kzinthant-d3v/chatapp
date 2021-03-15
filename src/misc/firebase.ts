import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBcuLUs4OWhYe6Y_jYvYEOLP-7vXF62pd4',
  authDomain: 'chatapp-eaad3.firebaseapp.com',
  databaseURL: 'https://chatapp-eaad3-default-rtdb.firebaseio.com',
  projectId: 'chatapp-eaad3',
  storageBucket: 'chatapp-eaad3.appspot.com',
  messagingSenderId: '703347822097',
  appId: '1:703347822097:web:e17c82cd10d955a1f1ebb0',
  measurementId: 'G-ZZH1PPD9JB',
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
