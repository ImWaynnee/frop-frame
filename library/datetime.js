import {differenceInHours, differenceInMinutes, format, isValid} from 'date-fns';

/**
 * Returns the true start date based on the game's reset timing.
 * The close resets at 9.30AM UTC.
 *
 * @returns Gets the most recent day start date.
 */
const getDayStart = () => {
  const now = new Date();
  console.log(now.getUTCHours())
  if (now.getUTCHours() < 9) {
    now.setUTCHours(now.getUTCHours() - 24);
  }

  now.setUTCHours(9, 30, 0, 0);
  return now;
};
// 5.30 PM SGT 

const convertDateForDisplay = date => {
    if (date == null || !isValid(new Date(date))) {
      return 'NIL';
    }

    const now = new Date();
    now.setHours(now.getHours() - 24);

    //const daysLeft = differenceInDays(date, now);
    const hoursLeft = differenceInHours(date, now) % 24;
    const minutesLeft = differenceInMinutes(date, now) % 60;
    //const secondsLeft = differenceInSeconds(date, now) % 60;

  
    return `${hoursLeft}h ${minutesLeft}m`;
  };

export { getDayStart, convertDateForDisplay };
