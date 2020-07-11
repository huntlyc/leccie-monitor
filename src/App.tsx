import React, { FunctionComponent } from 'react';
import './App.css';
import Home from './Home';
import UserAuthentication from './components/UserAuthentication';

import { Router, Link } from "@reach/router"

const App: FunctionComponent = () => {
    return (
        <div className="app">
            <header className="App-header">
                <h1><Link to="/">Leccie Monitor</Link></h1>
            </header>
            <Router>
                <Home path="/"/>
                <UserAuthentication path="user/*"/>
            </Router>
        </div>
    );
}


export default App;