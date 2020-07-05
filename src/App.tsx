import React, { useState, FunctionComponent } from 'react';
import './App.css';
import AlertBanner from './components/AlertBanner';
import ReadingForm from './components/InputForm';
import ReadingTable from './components/ReadingsTable';
import LastReading from './components/LastReading';
import IReading from './components/IReading';
import UserAuthentication from './components/UserAuthentication';
import { useAuth } from './hooks/useAuth'
import DataStore from './components/Datastore';


const App: FunctionComponent = () => {

    const auth = useAuth();


    const userLoggedOut = () => {
        updatePreviousReadings([]);
        shouldShowMenu(false);
    };

    // const userisAuthenticated = useCallback((firebaseUserID: string) => {
    //     dataStore.changeUser(firebaseUserID);
    //     dataStore.getAllReadings().then((res) => {
    //         if(res.length > 0){
    //             updatePreviousReadings(res);
    //         }
    //     });
    // },[dataStore]);

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

            if(auth && auth?.user && auth?.user?.uid){
                let ds = new DataStore();
                let dataStore = ds.get(auth.user.uid);

                dataStore.addReading(readingObj);

                let readings = previousReadings.slice(0);
                readings.unshift(readingObj);
                updatePreviousReadings(readings);
            }
        },
        clearAll: function(){
            if(auth && auth?.user && auth?.user?.uid){
                let ds = new DataStore();
                let dataStore = ds.get(auth?.user?.uid);
                updatePreviousReadings([]);
                dataStore.clearAllReadings();
            }
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

    const getMainContentArea = () => {
        if(!auth) return null;

        if(auth.user){
            return <ReadingTable previousReadings={previousReadings}/>;
        }else{
            return <UserAuthentication />;
        }
    };


    const getHeaderContentArea = () => {
        if(auth && auth.user){
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
                {auth && auth.user &&
                    <>
                        <button name="menu" onClick={toggleMenu}>{showMenu ? 'Close' : 'Menu'}</button>
                        <div data-testid="menu" className={showMenu ? 'popup active' : 'popup'}><button onClick={userLoggedOut}>Logout</button></div>
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
