import React, { useState, useEffect, FunctionComponent, useCallback } from 'react';
import './App.css';
import AlertBanner from './components/AlertBanner';
import ReadingForm from './components/InputForm';
import ReadingTable from './components/ReadingsTable';
import LastReading from './components/LastReading';
import IReading from './components/IReading';
import {FirebaseAuthentication} from './services/firebaseAuthentication'
import UserAuthentication from './components/UserAuthentication';
import FirebaseDataStore, { UserDatastore } from './components/Datastore';
import TestDatastore from './components/TestDataStore';

enum AuthState {
    init,
    noUser,
    authenticated
};

const App: FunctionComponent = () => {
    let dataStore: UserDatastore;

    if(process.env.NODE_ENV === 'test'){
        dataStore = new TestDatastore();
    }else{
        dataStore = new FirebaseDataStore();
    }

    const [applicationAuthState, updateAuthState] = useState(AuthState.init);

    const [firebaseUserID, setFirebaseUserID] = useState<string | null>(null);
    const logoutUser = () => {

        FirebaseAuthentication.logout().then(() =>{
            setFirebaseUserID(null);
            updatePreviousReadings([]);
            shouldShowMenu(false);
        });
    };

    const userisAuthenticated = useCallback((firebaseUserID: string) => {
        setFirebaseUserID(firebaseUserID);
        updateAuthState(AuthState.authenticated)
        dataStore.changeUser(firebaseUserID);
        dataStore.getAllReadings().then((res) => {
            if(res.length > 0){
                updatePreviousReadings(res);
            }
        });
    },[dataStore]);

    const [showMenu, shouldShowMenu] = useState(false);
    const toggleMenu = () => {
        shouldShowMenu(!showMenu);
    };


    const [previousReadings, updatePreviousReadings] = useState<IReading[]>([]);

    // Small collection of utility functions related to readings
    const readings = {
        add: function(reading: string){
            const readingObj: IReading = {
                date: new Date().toISOString(),
                reading: reading
            }

            dataStore.addReading(readingObj);

            let readings = previousReadings.slice(0);
            readings.unshift(readingObj);
            updatePreviousReadings(readings);
        },
        clearAll: function(){
            updatePreviousReadings([]);
            dataStore.clearAllReadings();
        },
        getMostRecent: function(){
            if(previousReadings && previousReadings[0]){
                return previousReadings[0];
            }

            return false;
        }
    };

    const lastReadingValue = readings.getMostRecent();
    const isRunningLow = lastReadingValue && parseFloat(lastReadingValue.reading) < 10;


    //On first run...
    useEffect(() => {
        let isStillRunning = true;

        FirebaseAuthentication.onUserChange().then((uid) => {
            if(isStillRunning && uid){
                userisAuthenticated(uid);
            }
        }).catch(() => {
            if(isStillRunning){
                setFirebaseUserID(null);
                updateAuthState(AuthState.noUser);
            }
        });
        return () => { isStillRunning = false };
    }, [userisAuthenticated]);


    const getMainContentArea = () => {
        switch(applicationAuthState){
            case AuthState.noUser: return <UserAuthentication onAuthenticated={userisAuthenticated} />;
            case AuthState.authenticated: return <ReadingTable previousReadings={previousReadings}/>;
            default: return null;
        }
    };


    const getHeaderContentArea = () => {
        switch(applicationAuthState){
            case AuthState.noUser: return null;
            case AuthState.authenticated:
                return (
                    <>
                        <ReadingForm onSuccess={readings.add} onClear={readings.clearAll} />
                        {lastReadingValue && <LastReading reading={lastReadingValue} isRunningLow={isRunningLow} />}
                    </>
                );
            default: return <p>Loading, please wait&hellip;</p>;
        }
    }

    return (
        <div className="App">
            {applicationAuthState === AuthState.authenticated && <button name="menu" onClick={toggleMenu}>{showMenu ? 'Close' : 'Menu'}</button>}
            {applicationAuthState === AuthState.authenticated && <div data-testid="menu" className={showMenu ? 'popup active' : 'popup'}><button onClick={logoutUser}>Logout</button></div>}
            <header className="App-header">
                <h1>Leccie Monitor</h1>
                <p>Don&rsquo;t be left in the dark&hellip;</p>
                {getHeaderContentArea()}
            </header>
            {getMainContentArea()}
            {isRunningLow && <AlertBanner/>}
        </div>
    );
}

export default App;
