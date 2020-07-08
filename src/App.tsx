import React, { useState, FunctionComponent, useEffect } from 'react';
import './App.css';
import AlertBanner from './components/AlertBanner';
import ReadingForm from './components/InputForm';
import ReadingTable from './components/ReadingsTable';
import LastReading from './components/LastReading';
import IReading from './components/IReading';
import UserAuthentication from './components/UserAuthentication';
import { useFirebase } from './hooks/useAuth'


const App: FunctionComponent = () => {

    const [isLoading, setIsLoadingTo] = useState(true);
    const firebase = useFirebase();
    const [showMenu, shouldShowMenu] = useState(false);
    const [previousReadings, updatePreviousReadings] = useState<IReading[]>([]);


    const toggleMenu = () => {
        shouldShowMenu(!showMenu);
    };


    // Small collection of utility functions related to readings
    const readings = {
        add: function(reading: string){

            const readingObj: IReading = {
                date: new Date().toISOString(),
                reading: reading
            }

            if(firebase && firebase?.user && firebase?.dataStore){

                firebase.dataStore.addReading(readingObj);

                let readings = previousReadings.slice(0);
                readings.unshift(readingObj);
                updatePreviousReadings(readings);
            }
        },
        clearAll: function(){
            if(firebase && firebase?.user && firebase?.dataStore){
                updatePreviousReadings([]);
                firebase.dataStore.clearAllReadings();
            }
        },
        getMostRecent: function(){
            if(previousReadings && previousReadings[0]){
                return previousReadings[0];
            }

            return false;
        }
    };


    const userLoggedOut = () => {
        updatePreviousReadings([]);
        shouldShowMenu(false);

        if(firebase){
            firebase.signout();
        }
    };

    useEffect(() => {
        let isActive = true;

        if(firebase && firebase.dataStore){
            firebase.dataStore.getAllReadings().then((res) => {
                if(isActive){
                    if(res.length > 0){
                        updatePreviousReadings(res);
                    }
                } 
            });
        }

        setIsLoadingTo(false);

        return () => { isActive = false };
    },[firebase]);


    const getMainContentArea = () => {
        if(isLoading) return <p>Loading...</p>;

        if(!firebase) return null;

        if(firebase.user){
            return <ReadingTable previousReadings={previousReadings}/>;
        }else{
            return <UserAuthentication />;
        }
    };


    const lastReadingValue = readings.getMostRecent();
    const isRunningLow = lastReadingValue && parseFloat(lastReadingValue.reading) < 10;


    const getHeaderContentArea = () => {
        if(firebase && firebase.user){
            return (
                <>
                    <ReadingForm onSuccess={readings.add} onClear={readings.clearAll} />
                    {lastReadingValue && <LastReading reading={lastReadingValue} isRunningLow={isRunningLow} />}
                </>
            );
        }
        return null;
    };

    const clearReadings = function(e: React.FormEvent){
        e.preventDefault();
        readings.clearAll();
    };

    return (
        <div className="App">
            {firebase && firebase.user &&
                <>
                    <button name="menu" onClick={toggleMenu}>{showMenu ? 'Close' : 'Menu'}</button>
                    <div data-testid="menu" className={showMenu ? 'popup active' : 'popup'}>
                        <ul>
                            <li><button onClick={clearReadings}>Clear Readings</button></li>
                        </ul>
                        <button onClick={userLoggedOut}>Logout</button>

                    </div>
                </>
            }
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