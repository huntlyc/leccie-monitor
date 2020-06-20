import React, { useState, useEffect, FunctionComponent } from 'react';
import './App.css';
import { ReadingStorage, DBReading } from './components/ReadingStore';
import AlertBanner from './components/AlertBanner';
import ReadingForm from './components/InputForm';
import ReadingTable from './components/ReadingsTable';
import LastReading from './components/LastReading';
import IReading from './components/IReading';


type AppProps = {
    dataStore: ReadingStorage
};


const App: FunctionComponent<AppProps> = ({dataStore}) => {
    const [previousReadings, updatePreviousReadings] = useState<DBReading[]>([]);

    const readings = {
        add: function(reading: string){
            const readingObj: IReading = {
                date: new Date().toISOString(),
                reading: reading
            }
            
            dataStore.readings.add(readingObj);
    
            let readings = previousReadings.slice(0);
            readings.unshift(readingObj);
            updatePreviousReadings(readings);
        },   
        clearAll: function(){
            updatePreviousReadings([]);
            dataStore.readings.clear();
        },
        getMostRecent: function(){
            if(previousReadings && previousReadings[0]){
                return previousReadings[0];
            }
    
            return false;
        }
    };


    // Ensure state and db are sync'd on first run
    useEffect(() => {
        let isReadingStore = true;

        if(dataStore){
            dataStore.readings.toArray().then((DBRes) => {
                if(isReadingStore){
                    if(DBRes.length > 0){
                        updatePreviousReadings(DBRes.reverse());
                    }
                }
            });
        }

        return () => { isReadingStore = false } ;

        // eslint-disable-next-line
    }, []);


    const lastReading = readings.getMostRecent();
    const isRunningLow = lastReading &&  parseFloat(lastReading.reading as string) < 10;


    return (
        <div className="App">
            {isRunningLow && <AlertBanner/>}
            <header className="App-header">
                <h1>Leccie Monitor</h1>
                <p>Don&rsquo;t be left in the dark&hellip;</p>
                {lastReading && <LastReading reading={lastReading} isRunningLow={isRunningLow} />}
                <ReadingForm onSuccess={readings.add} onClear={readings.clearAll} />
            </header>
            <ReadingTable previousReadings={previousReadings}/>
        </div>
    );
}

export default App;
