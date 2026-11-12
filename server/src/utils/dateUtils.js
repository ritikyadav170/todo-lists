const { startOfWeek, endOfWeek, addDays, formatISO } = require('date-fns');

/**
 * Escapes characters for safe RegExp construction
 */
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Gets Monday-based start and end of week for a given date
 */
const getWeekRange = (date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });     // Sunday
  return { start, end };
};

module.exports = {
  escapeRegex,
  getWeekRange,
};
