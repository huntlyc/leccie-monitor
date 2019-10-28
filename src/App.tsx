import React, { useState, useEffect } from 'react';
import './App.css';
import { ReadingStorage, DBReading } from './components/ReadingStore';
import { FirebaseContext } from './components/firebase';



//Simple struct for our Reading object
interface  Reading{
  date: String;
  reading: String;
}


  /**
   * Returns date/time string formatted to 'dd/mm/yyyy hh:mm'
   * @param dateStr String - date string to format
   * @returns formattedDateStr String - dateStr formatted to 'dd/mm/yyyy hh:mm'
   */
  const formatDate = (dateStr: String) => {
    const curDate = new Date();
    const date = new Date(Date.parse(dateStr as string));

    // zero pad our days, months, hours, and minutes if < 10.  e.g '02' instead of '2'
    let d:any = date.getDate();
    if(d < 10) d = `0${d}`;

    let m:any = date.getMonth() + 1;
    if(m < 10) m = `0${m}`;

    let h:any = date.getHours();
    if(h < 10) h = `0${h}`;

    let i:any = date.getMinutes();
    if(i < 10) i = `0${i}`;


    /***
     * We want to show 'nice' date diffs, i.e:
     * today, yesterday, this week...
     *
     * We do this by comparing the current time to the reading time
     * and come up with the following
     *
     * just now - < 1min ago
     * a minute ago - 1min ago
     * $N mins ago - < 1 hour ago
     * today at hh:mm - <= 24 hours ago, but after midnight of the current day
     * yesterday at hh:mm - <= 24 hours ago (but before midnight of current day)
     * yesterday at hh:mm - 1 day ago
     * $DAY at hh:mm - in the last 7 days but part of the current week
     *
     * dd/mm/yyyy hh:mm - if none of the above match, just show full date
     *
     */
    const dateDiff = curDate.getTime() - date.getTime();
    const dateDiffInMins = Math.round((dateDiff/1000)/60);

    //happened less than a min ago
    if(dateDiffInMins < 1){
      return 'just now';
    }

    //Happened less than an hour ago
    if(dateDiffInMins < 60){
      if(dateDiffInMins === 1){
        return `a minute ago`;

      }
      return `${dateDiffInMins} minutes ago`;
    }

    //Happened in the 24hrs
    const dateDiffInHours = Math.round((dateDiffInMins/60));
    if(dateDiffInHours <= 24){
      //check if happened today (i.e from midnight)
      if( date.getHours() > 0 && date.getHours() < curDate.getHours()){
        return `today at ${h}:${i}`;
      }else{
        return `yesterday at ${h}:${i}`;
      }
    }

    const dateDiffInDays = Math.round((dateDiffInHours/24));

    //Happened 1 day ago (yesterday)
    if(dateDiffInDays === 1){
      return `yesterday at ${h}:${i}`;
    }

    //Happened in the last 7 days
    if(dateDiffInDays < 7){
      const curDayOfTheWeek = curDate.getDay() === 0 ? 7 : curDate.getDay();
      const readingDayOfTheWeek = date.getDay() === 0 ? 7 : date.getDay();
      // check if current week (mon - sun)
      if(curDayOfTheWeek - readingDayOfTheWeek >  0){
        const fullDayName =  new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(date);
        return `${fullDayName.toLowerCase()} at ${h}:${i}`;

      }
    }

    //Happened at some point, show full date
    return `${d}/${m}/${date.getFullYear()} ${h}:${i}`;
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
                  <td className="date">{formatDate(reading.date)}</td>
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
        {lastReading && <p>Last reading: <strong className={parseFloat(lastReading.reading as string) < 10 ? 'danger': ''}>&pound;{lastReading.reading}</strong> - <span className="date">{formatDate(lastReading.date)}</span></p>}
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
