import React, { FunctionComponent, useState } from 'react';
import './App.css';
import Home from './Home';
import UserAuthentication from './components/UserAuthentication';
import { Router, Link } from "@reach/router"
import UserDash from './components/UserDash';
import { useFirebase } from './hooks/useFirebase';


const App: FunctionComponent = () => {
    const firebase = useFirebase();
    const [showMenu, shouldShowMenu] = useState(false);


    const toggleMenu = () => {
        shouldShowMenu(!showMenu);
    };


    const userLoggedOut = () => {
        shouldShowMenu(false);

        if (firebase) {
            firebase.signout();
        }
    };


    const clearReadings = () => {
        if (firebase && firebase?.user && firebase?.dataStore) {
            firebase.dataStore.clearAllReadings();
        }
    };


    return (
        <div className="app">
            {firebase && firebase.user &&
                <>
                    <button name="menu" onClick={toggleMenu}><img alt="Menu Icon - click to toggle menu" src={process.env.PUBLIC_URL + "/gear.svg"} /><span className="sr-only">{showMenu ? 'Close' : 'Menu'}</span></button>
                    {showMenu && <div onClick={toggleMenu} className="overlay"></div>}
                    <div data-testid="menu" className={showMenu ? 'popup active' : 'popup'}>
                        <div>
                            <button className="close" onClick={toggleMenu}><span className="sr-only">Close </span>&times;</button>
                            <h5>Signed in as<br/>{firebase.user.email}</h5>
                            <ul>
                                <li><Link to="/" onClick={toggleMenu}>Readings</Link></li>
                                <li><Link to="/my-account/" onClick={toggleMenu}>Your Account</Link></li>
                            </ul>
                        </div>
                        <button onClick={userLoggedOut}>Logout</button>
                    </div>
                </>
            }
            <header className="App-header">
                <h1><Link to="/">Leccie Monitor</Link></h1>
            </header>
            <Router>
                <Home path="/"/>
                <UserDash path="my-account" clearReadings={clearReadings} />
                <UserAuthentication path="auth/*"/>
            </Router>
        </div>
    );
};


export default App;