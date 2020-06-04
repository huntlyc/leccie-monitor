import React, { useState, useEffect } from 'react';
import './App.css';
import { ReadingStorage, DBReading } from './components/ReadingStore';
// import { FirebaseContext } from './components/firebase';
import { formatRelativeToDate } from './Utils'
import ReadingForm from './components/InputForm';
import ReadingTable from './components/ReadingsTable';
import IReading from './components/IReading';


const App: React.FC = () => {
    const db: ReadingStorage = new ReadingStorage();

    // App state: last reading is the last known input, previous readings is the DB readings
    const [latestReading, updateLatestReading] = useState<IReading | undefined>(undefined);
    const [previousReadings, updatePreviousReadings] = useState<DBReading[] | undefined>(undefined);
    const [devMode, updateDevMode] = useState<boolean>(false);

    // Have an effect hook to update our previous readings only if our DB readings changes
    useEffect(() => {
        if (!latestReading || (!previousReadings || previousReadings.length === 0) || (previousReadings[0]).date !== latestReading.date) {
            db.readings.toArray().then((res) => {
                res.reverse()
                updatePreviousReadings(res);
            });
        }
    }, [db.readings, latestReading, previousReadings]);

    // Have an effectHook to update our previous reading if loading for first time
    useEffect(() => {
        if (!latestReading && previousReadings) {
            updateLatestReading(previousReadings[0]);
        }
    }, [previousReadings, latestReading]);

  
    const saveReading = function(reading: string){
        const readingObj: IReading = {
            date: new Date().toISOString(),
            reading: reading
        }

        //Update our state
        updateLatestReading(readingObj);

        //Save to db
        db.readings.add(readingObj);

    };





    const devClearData = (e: React.MouseEvent) => {
        e.preventDefault();

        if (window.confirm('Are you sure? No takebaks!')) {
            db.clearData();
        }
    }


    const devSeedData = (e: React.MouseEvent) => {
        e.preventDefault();
        if (window.confirm('Are you sure? No takebaks!')) {
            db.clearData();
            db.seedData();
        }
    }


    const handleDev = (e: React.MouseEvent) => {
        updateDevMode(!devMode);
    }


    return (
        <div className="App">
            {latestReading && parseFloat(latestReading.reading as string) < 10 && <div id="alert-banner">Running low, go top up!!!</div>}
            <header className="App-header">
                <h1 onClick={handleDev}>Leccie Monitor</h1>
                <p>Don&rsquo;t be left in the dark&hellip;</p>
                <ReadingForm onSuccess={saveReading} />
                {latestReading && <p>Last reading: <strong className={parseFloat(latestReading.reading as string) < 10 ? 'danger' : ''}>&pound;{latestReading.reading}</strong> - <span className="date">{formatRelativeToDate(latestReading.date as string, new Date().toISOString())}</span></p>}
            </header>
            <ReadingTable previousReadings={previousReadings} lastReading={latestReading}/>
            <section id="dev" className={devMode ? 'active' : ''}>
                <h2>Settings</h2>
                <ul>
                    <li><a href="#clear" onClick={devClearData}>Clear Data</a></li>
                    <li><a href="#seed" onClick={devSeedData}>Seed Data</a></li>
                </ul>
                {/* <FirebaseContext.Consumer>
          {firebase => {
            return <div>I've access to Firebase and render something.</div>;
          }}
        </FirebaseContext.Consumer> */}
            </section>
        </div>
    );
}

export default App;

