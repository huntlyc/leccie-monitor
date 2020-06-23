import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { LocalStorageReadingStore, IReadingStore } from './components/ReadingStore';
import firebase from 'firebase/app';
import 'firebase/firestore';

import * as serviceWorker from './serviceWorker';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    applicationId: process.env.REACT_APP_FB_APP_ID,
    projectId: process.env.REACT_APP_PROJECT_ID,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore().collection('readings')

ReactDOM.render(
    <App dataStore={db} />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
