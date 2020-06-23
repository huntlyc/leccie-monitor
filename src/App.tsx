import React, { useState, useEffect, FunctionComponent } from 'react';
import './App.css';
import { IReadingStore } from './components/ReadingStore';
import AlertBanner from './components/AlertBanner';
import ReadingForm from './components/InputForm';
import ReadingTable from './components/ReadingsTable';
import LastReading from './components/LastReading';
import IReading from './components/IReading';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';



type AppProps = {
    dataStore: firebase.firestore.CollectionReference
};


const App: FunctionComponent<AppProps> = ({dataStore}) => {
    const [previousReadings, updatePreviousReadings] = useState<IReading[]>([]);
    const [showLogin, setLoginStatusTo] = useState(false);
    const [firebaseUserID, setFirebaseUserID] = useState<string | null>();


    const authFirebase = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = (document.querySelector('input[type=email]') as HTMLInputElement).value;
        const pass = (document.querySelector('input[type=password]') as HTMLInputElement).value;


        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        firebase.auth().signInWithEmailAndPassword(email, pass).then((userCred) => {
            setFirebaseUserID(userCred?.user?.uid);
        }).catch((err) => {
            console.log(err);
        });
        
    }
    
    // Ensure state and db are sync'd on first run
    useEffect(() => {
        let isReadingStore = true;

        //Token should be refreshed for local users, tap into it and set id
        firebase.auth().onIdTokenChanged((userCred) => {
            setFirebaseUserID(userCred?.uid);
        });


        
      
        return () => { isReadingStore = false } ;

        // eslint-disable-next-line
    }, []);


    const readings = {
        add: function(reading: string){
            const readingObj: IReading = {
                date: new Date().toISOString(),
                reading: reading
            }
            
            // dataStore.addReading(readingObj);
    
            let readings = previousReadings.slice(0);
            readings.unshift(readingObj);
            updatePreviousReadings(readings);
        },   
        clearAll: function(){
            updatePreviousReadings([]);
            // dataStore.clearAllReadings();
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
            
            <div className={showLogin ? 'popup active' : 'popup'}>
                {!firebaseUserID &&
                    <form action="post" onSubmit={authFirebase}>
                        
                            <label htmlFor="email">Email</label><br/>
                            <input type="email" id="email" name="email"/><br/>
                            <br/>
                            <label htmlFor="password">Password</label><br/>
                            <input type="password" id="password" name="password"/><br/>
                            <br/>
                            <button type="submit">Login</button>
                    </form>
                }
                {firebaseUserID && 
                    <p>
                        <label htmlFor="fbuid">FB UID</label>
                        <input id="fbuid" type="text" readOnly value={firebaseUserID}/>
                    </p>
                }

            </div>
            <header className="App-header">
                <h1 onClick={toggleLogin}>Leccie Monitor</h1>
                <p>Don&rsquo;t be left in the dark&hellip;</p>
                {lastReading && <LastReading reading={lastReading} isRunningLow={isRunningLow} />}
                <ReadingForm onSuccess={readings.add} onClear={readings.clearAll} />
            </header>
            <ReadingTable previousReadings={previousReadings}/>
        </div>
    );
}

export default App;
