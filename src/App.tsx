import React, { useState, useEffect } from 'react';
import './App.css';
import { ReadingStorage, DBReading } from './components/ReadingStore';
import { FirebaseContext } from './components/firebase';
import { formatRelativeToDate } from './Utils'



//Simple struct for our Reading object
interface  Reading{
  date: String;
  reading: String;
}

const App: React.FC = () => {
  const db:ReadingStorage = new ReadingStorage();

  // App state: last reading is the last known input, previous readings is the DB readings
  const [lastReading, updateLastReading] = useState<Reading | undefined>(undefined);
  const [previousReadings, updatePreviousReadings] = useState<DBReading[] | undefined>(undefined);
  const [devMode, updateDevMode] = useState<boolean>(false);

  // Have an effect hook to update our previous readings only if our DB readings changes
  useEffect(() => {
    if(!lastReading || (!previousReadings || previousReadings.length === 0) || (previousReadings[0]).date !== lastReading.date){
      db.readings.toArray().then( (res) => {
        res.reverse()
        updatePreviousReadings(res);
      });
    }
  }, [db.readings, lastReading, previousReadings]);

  // Have an effectHook to update our previous reading if loading for first time
  useEffect(() => {
    if (!lastReading && previousReadings) {
      updateLastReading(previousReadings[0]);
    }
  }, [previousReadings, lastReading]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //Grab a hold of our input
    const lastReading: HTMLInputElement|null = (document.getElementById('reading') as HTMLInputElement);

    //Save only if 'good' numerical value
    if (lastReading && !isNaN(parseFloat(lastReading.value))) {

      const readingObj:Reading = {
        date: new Date().toISOString(),
        reading: parseFloat(lastReading.value).toFixed(2)
      }

      //Update our state
      updateLastReading(readingObj);

      //Save to db
      db.readings.add(readingObj);

      //Clean up form
      lastReading.value = '';
      lastReading.focus();
      lastReading.classList.remove('error');

    } else {
      lastReading.classList.add('error');
    }
  };




  /**
   * Returns JSX for rendering previous readings table
   */
  const renderPreviousReadings = () => {

    //If no readings, explain to the user to enter their first reading
    if(!previousReadings || previousReadings.length === 0) return <p>Enter your first reading to get started!</p>;

    return(
      <section id="last-readings">
        <h2>Previous Readings</h2>
        <table>
          <thead>
            <tr>
              <th>Reading</th>
              <th>+/- Diff</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {previousReadings.map((reading, i) => {

              let clsName:string = ''
              let txtDiff:string = ' \u2014 ';

              //dont (obviously) run on the first result as there's no difference!!
              if(i < previousReadings.length -1){

                let diff:number = 0;
                let curReading:number = parseFloat(reading.reading as string);
                let prevReading:number = parseFloat(previousReadings[++i].reading as string);

                diff = curReading - prevReading;

                if(diff === 0){
                  txtDiff = '';
                }else if(diff > 0){
                  txtDiff = `+${diff.toFixed(2)}`;
                  clsName = 'positive';
                }else{
                  txtDiff = `${diff.toFixed(2)}`;
                  clsName = 'minus';
                }
              }

              return (
                <tr  className={i === 1 && lastReading && parseFloat(lastReading.reading as string) < 10 ? 'danger-row': ''} key={reading.date as string}>
                  <td>&pound;{reading.reading}</td>
                  <td className={clsName}>{txtDiff}</td>
                  <td className="date">{formatRelativeToDate(reading.date as string, new Date().toISOString())}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    );
  }


  const devClearData = (e: React.MouseEvent) => {
    e.preventDefault();

    if(window.confirm('Are you sure? No takebaks!')){
      db.clearData();
    }
  }

  const devSeedData = (e: React.MouseEvent) => {
    e.preventDefault();
    if(window.confirm('Are you sure? No takebaks!')){
      db.clearData();
      db.seedData();
    }
  }

  const handleDev = (e: React.MouseEvent) => {
    updateDevMode(!devMode);
  }


  return (
    <div className="App">
      {lastReading && parseFloat(lastReading.reading as string) < 10 && <div id="alert-banner">Running low, go top up!!!</div> }
      <header className="App-header">
        <h1 onClick={handleDev}>Leccie Monitor</h1>
        <p>Don&rsquo;t be left in the dark&hellip;</p>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="reading" className="sr-only">Latest Reading</label>
          <input type="text" id="reading" placeholder="Reading (e.g. 34.22)" />
          <button><span className="sr-only">Submit Reading</span>+</button>
        </form>
        {lastReading && <p>Last reading: <strong className={parseFloat(lastReading.reading as string) < 10 ? 'danger': ''}>&pound;{lastReading.reading}</strong> - <span className="date">{formatRelativeToDate(lastReading.date as string, new Date().toISOString())}</span></p>}
      </header>
      {previousReadings && renderPreviousReadings()}
      <section id="dev" className={devMode ? 'active' : ''}>
        <h2>Settings</h2>
        <ul>
          <li><a href="#clear" onClick={devClearData}>Clear Data</a></li>
          <li><a href="#seed" onClick={devSeedData}>Seed Data</a></li>
        </ul>
        <FirebaseContext.Consumer>
          {firebase => {
            return <div>I've access to Firebase and render something.</div>;
          }}
        </FirebaseContext.Consumer>
      </section>
    </div>
  );
}

export default App;
