import React, { useState, useEffect, FunctionComponent } from 'react';
import './App.css';
import AlertBanner from './components/AlertBanner';
import ReadingForm from './components/InputForm';
import ReadingTable from './components/ReadingsTable';
import LastReading from './components/LastReading';
import IReading from './components/IReading';
import firebase from 'firebase/app';
import 'firebase/auth';
import { UserDatastore } from './components/Datastore';
import firebaseConfig from './firebaseConfig';
import UserAuthentication from './components/UserAuthentication';



type AppProps = {
    dataStore: UserDatastore
};


const App: FunctionComponent<AppProps> = ({dataStore}) => {
    const [isCheckingUser, updateIsCheckingUser] = useState(true);

    const [firebaseUserID, setFirebaseUserID] = useState<string | null>();
    const logoutUser = () => {
        firebase.auth().signOut().then(() => {
            setFirebaseUserID(null);
            updatePreviousReadings([]);
            shouldShowMenu(false);
        });
    };


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

        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }

        firebase.auth().onIdTokenChanged((user) => {
            if(user && user?.uid && user.uid !== firebaseUserID){
                if(isStillRunning) {
                    console.log('setting shit');
                    setFirebaseUserID(user.uid);
                }
            }

            if(isStillRunning){
                    console.log('setting more shit');
                updateIsCheckingUser(false);
            }
        });
        // eslint-disable-next-line
        return () => { isStillRunning = false };
    }, []);


    //Whenever our user changes
    useEffect(() => {
        let isReadingStore = true;
        if(firebaseUserID){
            dataStore.changeUser(firebaseUserID);
            dataStore.getAllReadings().then((res) => {
                if(isReadingStore && res.length > 0){
                    updatePreviousReadings(res)
                }
            });
        }
        return () => { isReadingStore = false } ;
    }, [firebaseUserID, dataStore]);


    const getMainContentArea = () => {
        if(isCheckingUser) return null;

        if(firebaseUserID){
            return <ReadingTable previousReadings={previousReadings}/>
        }else{
            return <UserAuthentication onAuthenticated={setFirebaseUserID} />
        }
    };


    const getHeaderContentArea = () => {
        if(isCheckingUser) return <p>Loading, please wait&hellip;</p>;

        if(firebaseUserID){
            return (
                <>
                    <ReadingForm onSuccess={readings.add} onClear={readings.clearAll} />
                    {lastReadingValue && <LastReading reading={lastReadingValue} isRunningLow={isRunningLow} />}
                </>
            );
        }

        return null;
    }

    return (
        <div className="App">
            {isRunningLow && <AlertBanner/>}
            <header className="App-header">
                <h1 >Leccie Monitor</h1>
                <p>Don&rsquo;t be left in the dark&hellip;</p>
                {getHeaderContentArea()}
            </header>
            {getMainContentArea()}
            {!isCheckingUser && firebaseUserID && <button name="menu" onClick={toggleMenu}>{showMenu ? 'Close' : 'Menu'}</button>}
            {!isCheckingUser && firebaseUserID && <div data-testid="menu" className={showMenu ? 'popup active' : 'popup'}><button onClick={logoutUser}>Logout</button></div>}
        </div>
    );
}

export default App;
