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
    const [previousReadings, updatePreviousReadings] = useState<DBReading[] | undefined>(undefined);

    const addNewReading = function(reading: string){
        saveReading(reading);
        refreshStateFromDB(dataStore);
    };

    const saveReading = function(reading: string){
        const readingObj: IReading = {
            date: new Date().toISOString(),
            reading: reading
        }

        dataStore.readings.add(readingObj);
    };

    const refreshStateFromDB = async function(dataStore:ReadingStorage){
        const DBRes = await dataStore.readings.toArray();

        if(DBRes.length > 0){
            updatePreviousReadings(DBRes.reverse());
        }
    };

    // Ensure state and db are sync'd on first run
    useEffect(() => {
        refreshStateFromDB(dataStore);
    }, [dataStore]);

    return (
        <div className="App">
            {previousReadings && previousReadings[0] && parseFloat(previousReadings[0].reading as string) < 10 && <div id="alert-banner">Running low, go top up!!!</div>}
            <header className="App-header">
                <h1>Leccie Monitor</h1>
                <p>Don&rsquo;t be left in the dark&hellip;</p>
                {previousReadings && previousReadings[0] && <p data-testid="last-reading">Last reading: <strong data-testid="last-reading-price"  className={parseFloat(previousReadings[0].reading as string) < 10 ? 'danger' : ''}>&pound;{previousReadings[0].reading}</strong> - <span data-testid="last-reading-date" className="date">{formatRelativeToDate(previousReadings[0].date as string, new Date().toISOString())}</span></p>}
                <ReadingForm onSuccess={addNewReading} />
            </header>
            <ReadingTable previousReadings={previousReadings}/>
        </div>
    );
}

export default App;
