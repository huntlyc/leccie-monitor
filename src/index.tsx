import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { LocalStorageReadingStore, IReadingStore } from './components/ReadingStore';

import * as serviceWorker from './serviceWorker';


const db: IReadingStore = new LocalStorageReadingStore();

ReactDOM.render(
    <App dataStore={db} />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
