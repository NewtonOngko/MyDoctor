import moment from 'moment';
import momentTimezone from 'moment-timezone';

// import moment from 'moment';
const today = new Date();
let seconds = '0' + today.getSeconds();
let hour = '0' + today.getHours();
let minute = '0' + today.getMinutes();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();
let timeStamp = today.getTime();
let currentTimeStamp = moment().unix();
let fullDate = moment().format('MMMM Do YYYY');
let momentSeconds = '0' + moment().seconds().toString();
let momentMinutes = '0' + moment().minutes().toString();
let momentHours = '0' + moment().hours().toString();

let timeZone = momentTimezone.tz(momentTimezone.tz.guess(true)).zoneAbbr();

momentSeconds = momentSeconds.slice(-2);
momentHours = momentHours.slice(-2);
momentMinutes = momentMinutes.slice(-2);
currentTimeStamp = currentTimeStamp.toString();
let combineDate = `${year}-${month}-${day}`;

export {
  timeZone,
  seconds,
  hour,
  minute,
  day,
  month,
  year,
  combineDate,
  timeStamp,
  fullDate,
  momentHours,
  momentSeconds,
  momentMinutes,
  currentTimeStamp,
};
