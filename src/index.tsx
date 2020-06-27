import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'firebase/firestore';

import * as serviceWorker from './serviceWorker';
import FirebaseDataStore from './components/Datastore';


const db = new FirebaseDataStore();

ReactDOM.render(
    <App dataStore={db} />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
