// Misc util functions


/**
 * Given date string, returns zero padded values 
 * 
 * Returns object with PHP style date pieces: h - hour, i - minute
 * @param dateString string - parsable date string
 */
export const getDatePieces = function(dateString: string){

    const date = new Date(Date.parse(dateString as string));

    // zero pad our days, months, hours, and minutes if < 10.  e.g '02' instead of '2'
    let d:any = date.getDate();
    if(d < 10){
      d = `0${d}`;
    }else{
      d = `${d}`;
    }

    let m:any = date.getMonth() + 1;
    if(m < 10){
      m = `0${m}`;
    }else{
      m = `${m}`;
    }

    let h:any = date.getHours();
    if(h < 10){
      h = `0${h}`;
    }else{
      h = `${h}`;
    }

    let i:any = date.getMinutes();
    if(i < 10){
      i = `0${i}`;
    }else{
      i = `${i}`;
    }

    const y:any = `${date.getFullYear()}`;

    return {
      d,
      m,
      y,
      h,
      i
    };
};

/**
 * Given two dates, return relative format (today at.., yesterday at... e.t.c)
 * 
 * @param dateStr String - date string to format
 * @param relativeDateString String - date string to format
 * @returns formattedDateStr String - dateStr formatted to 'dd/mm/yyyy hh:mm'
 */
export const formatRelativeToDate = (dateString: String, relativeDateString: String) => {
  

  const relativeDateTimeStamp = Date.parse(relativeDateString as string);
  const dateTimestamp = Date.parse(dateString as string);

  const relativeDate = new Date(relativeDateTimeStamp);
  const theDate = new Date(dateTimestamp);

  if(dateTimestamp > relativeDateTimeStamp){ 
    throw new Error('Can not compare into the future'); 
  }

  const dateDiff = relativeDate.getTime() - theDate.getTime();
  const dateDiffInMins = Math.round((dateDiff/1000)/60);
  const {d,m,y,h,i} = getDatePieces(dateString as string);
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
    if( theDate.getHours() > 0 && theDate.getHours() < relativeDate.getHours()){
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
    const curDayOfTheWeek = relativeDate.getDay() === 0 ? 7 : relativeDate.getDay();
    const readingDayOfTheWeek = theDate.getDay() === 0 ? 7 : theDate.getDay();
    // check if current week (mon - sun)
    if(curDayOfTheWeek - readingDayOfTheWeek >  0){
      const fullDayName =  new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(theDate);
      return `${fullDayName.toLowerCase()} at ${h}:${i}`;

    }
  }

  //Happened at some point, show full date
  return `${d}/${m}/${y} at ${h}:${i}`;
}
