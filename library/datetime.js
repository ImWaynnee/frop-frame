import {format, isValid} from 'date-fns';

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
  
    return format(new Date(`${date}Z`), 'do MMMM yyyy hh:mm aaa');
  };

export { getDayStart, convertDateForDisplay };
