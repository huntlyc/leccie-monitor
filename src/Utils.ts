// Misc util functions


/**
 * @typedef {Object} DatePiecesObject - broken down date object
 * @property {string} d - day
 * @property {string} m - month
 * @property {string} y - year
 * @property {string} h - hours (24)
 * @property {string} i - minutes
 */
type DatePiecesObject = {
  d: string;
  m: string;
  y: string;
  h: string;
  i: string;
};

/**
 * Given date string, returns zero padded values in object form
 *
 * @param {string} dateString  - parsable date string
 * @returns {DatePiecesObject} parsed date in zero-padded object
 */
export const getDatePieces = (dateString: string): DatePiecesObject => {

    const date = new Date(Date.parse(dateString));

    return {
      d: `${date.getDate()}`.padStart(2, '0'),
      m: `${date.getMonth() + 1}`.padStart(2, '0'),
      y: `${date.getFullYear()}`,
      h: `${date.getHours()}`.padStart(2, '0'),
      i: `${date.getMinutes()}`.padStart(2, '0'),
    };
};

/**
 * Given two dates, return relative format (today at.., yesterday at... e.t.c)
 *
 * @param {string} dateStr - date string to format
 * @param {string} relativeDateString - date string to format
 * @return {string} human readable date in a relative format
 */
export const formatRelativeToDate = (dateString: string, relativeDateString: string) => {
  const relativeDateTimeStamp = Date.parse(relativeDateString);
  const dateTimestamp = Date.parse(dateString);

  const relativeDate = new Date(relativeDateTimeStamp);
  const theDate = new Date(dateTimestamp);

  if(dateTimestamp > relativeDateTimeStamp){
    throw new Error('Can not compare into the future');
  }

  const dateDiff = relativeDate.getTime() - theDate.getTime();
  const dateDiffInMins = Math.round((dateDiff/1000)/60);
  const {d,m,y,h,i} = getDatePieces(dateString);

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

export const humanReadableFirebaseError = (error: string):string => {
  let humanError = "An error occurred, please try later";
  const errMap = [
    {
      key: 'auth/wrong-password',
      value: "Incorrect login details!"
    },
    {
      key: 'auth/user-not-found',
      value: "Incorrect login details!"
    },
    {
      key: 'auth/weak-password',
      value: "Weak password, create a stronger one"
    },
    {
      key: 'auth/email-already-in-use',
      value: "You're already registered, please login"
    },
  ];

  let matches = errMap.filter((e) => e.key === error);
  if(matches){
    humanError = matches[0].value;
  }
  console.log(matches);

  return humanError;
}

/**
 * Std SO email regex
 * @param email - email to validate
 * @return boolean
 */
export const isValidEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};