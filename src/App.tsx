import React, { useState, useEffect, FunctionComponent } from 'react';
import './App.css';
import AlertBanner from './components/AlertBanner';
import ReadingForm from './components/InputForm';
import ReadingTable from './components/ReadingsTable';
import LastReading from './components/LastReading';
import IReading from './components/IReading';
import firebase from 'firebase/app';
import 'firebase/auth';
import LoginForm from './components/LoginForm';
import FirebaseDataStore, { UserDatastore } from './components/Datastore';
import firebaseConfig from './firebaseConfig';

const envPersistenceStrategy = process.env.NODE_ENV === 'test' 
  ? firebase.auth.Auth.Persistence.NONE 
  : firebase.auth.Auth.Persistence.LOCAL;


type AppProps = {
    dataStore: UserDatastore
};



const App: FunctionComponent<AppProps> = ({dataStore}) => {
    const [previousReadings, updatePreviousReadings] = useState<IReading[]>([]);
    const [showLogin, setLoginStatusTo] = useState(false);
    const [firebaseUserID, setFirebaseUserID] = useState<string | null>();
 


    const authFirebase = async (email: string, pass: string) => {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
        firebase.auth().setPersistence(envPersistenceStrategy).then(() => {
            firebase.auth().signInWithEmailAndPassword(email, pass).then((userCred) => {
                if(userCred && userCred.user && userCred.user.uid){
                    setFirebaseUserID(userCred?.user?.uid);
                    dataStore = new FirebaseDataStore(userCred.user.uid);
                }
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => { // Persistence not supported on browser
            console.log(err);
        });
    }
    
    // Ensure state and db are sync'd on first run
    useEffect(() => {
        let isReadingStore = true;

        if(dataStore){
            dataStore.getAllReadings().then((res) => {
                if(isReadingStore && res.length > 0){
                    updatePreviousReadings(res)
                }
            })
        }

        return () => { isReadingStore = false } ;

        // eslint-disable-next-line
    }, []);


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

    const toggleLogin = () =>{
        setLoginStatusTo(!showLogin);
    }


    const lastReading = readings.getMostRecent();
    const isRunningLow = lastReading && parseFloat(lastReading.reading) < 10;


    return (
        <div className="App">
            {isRunningLow && <AlertBanner/>}
            
            <div data-testid="menu" className={showLogin ? 'popup active' : 'popup'}>
                {!firebaseUserID &&
                    <LoginForm onValidSubmit={authFirebase}/>
                }
                {firebaseUserID && 
                    <p data-testid="fb-user-id">
                        <label htmlFor="fbuid">FB UID</label>
                        <input id="fbuid" type="text" readOnly value={firebaseUserID}/>
                    </p>
                }

            </div>
            <header className="App-header">
                <button name="menu" onClick={toggleLogin}>{showLogin ? 'Close' : 'Menu'}</button>
                <h1 >Leccie Monitor</h1>
                <p>Don&rsquo;t be left in the dark&hellip;</p>
                {lastReading && <LastReading reading={lastReading} isRunningLow={isRunningLow} />}
                <ReadingForm onSuccess={readings.add} onClear={readings.clearAll} />
            </header>
            <ReadingTable previousReadings={previousReadings}/>
        </div>
    );
}

export default App;
