import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ProvideAuth  } from './hooks/useFirebase'


ReactDOM.render(
    <ProvideAuth>
        <App />
    </ProvideAuth>,
    document.getElementById('root')
);


serviceWorker.register();
