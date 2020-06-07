import React, { useState, useEffect, FunctionComponent } from 'react';
import './App.css';
import { ReadingStorage, DBReading } from './components/ReadingStore';
import { formatRelativeToDate } from './Utils'
import ReadingForm from './components/InputForm';
import ReadingTable from './components/ReadingsTable';
import IReading from './components/IReading';

type AppProps = {
    dataStore: ReadingStorage
}

const App: FunctionComponent<AppProps> = ({dataStore}) => {
    // App state: last reading is the last known input, previous readings is the DB readings
    const [latestReading, updateLatestReading] = useState<IReading | undefined>(undefined);
    const [previousReadings, updatePreviousReadings] = useState<DBReading[] | undefined>(undefined);


    // Have an effect hook to update our previous readings only if our DB readings changes
    useEffect(() => {
        const noPreviousReadings = (!previousReadings || previousReadings.length === 0); 
        const readingDatesMismatch = (latestReading && previousReadings && previousReadings.length > 0 && (previousReadings[0]).date !== latestReading.date);

        if (!latestReading || noPreviousReadings || readingDatesMismatch) {
            dataStore.readings.toArray().then((res) => {
                res.reverse()
                updatePreviousReadings(res);
            });
        }

    }, [dataStore.readings, latestReading, previousReadings]);


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
        dataStore.readings.add(readingObj);

    };


    return (
        <div className="App">
            {latestReading && parseFloat(latestReading.reading as string) < 10 && <div id="alert-banner">Running low, go top up!!!</div>}
            <header className="App-header">
                <h1>Leccie Monitor</h1>
                <p>Don&rsquo;t be left in the dark&hellip;</p>
                {latestReading && <p>Last reading: <strong className={parseFloat(latestReading.reading as string) < 10 ? 'danger' : ''}>&pound;{latestReading.reading}</strong> - <span className="date">{formatRelativeToDate(latestReading.date as string, new Date().toISOString())}</span></p>}
                <ReadingForm onSuccess={saveReading} />
            </header>
            <ReadingTable previousReadings={previousReadings} lastReading={latestReading}/>
        </div>
    );
}

export default App;

