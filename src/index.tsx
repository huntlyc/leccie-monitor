import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ReadingStorage } from './components/ReadingStore';

import * as serviceWorker from './serviceWorker';


const db: ReadingStorage = new ReadingStorage();

ReactDOM.render(
    <App dataStore={db} />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
