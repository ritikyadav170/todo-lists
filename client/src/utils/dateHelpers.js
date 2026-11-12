import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isToday,
  isThisWeek,
} from 'date-fns';

/**
 * Format a Date or ISO string safely
 */
export const formatDate = (date, formatStr = 'dd MMM yyyy') => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
};

/**
 * Format date range for weekly cards (e.g. "10 Nov - 16 Nov")
 */
export const formatWeekRange = (weekStart, weekEnd) => {
  if (!weekStart) return '';
  const start = typeof weekStart === 'string' ? parseISO(weekStart) : weekStart;
  // Always derive 6 days later from Monday start to ensure accurate Monday - Sunday range regardless of timezone shifts
  const end = addDays(start, 6);

  const startStr = format(start, 'dd MMM');
  const endStr = format(end, 'dd MMM');
  return `${startStr} - ${endStr}`;
};

/**
 * Generates an array of dates around the current week for the horizontal day strip
 * Matches Figma: Sun, Mon, Tue, Wed, Thu, Fri, Sat, Sun
 */
export const getDayStripDates = (baseDate = new Date()) => {
  const current = typeof baseDate === 'string' ? parseISO(baseDate) : baseDate;
  const monday = startOfWeek(current, { weekStartsOn: 1 });
  // Include Sunday before Monday through following Sunday (8 days total or 7 days)
  const sundayBefore = addDays(monday, -1);

  const days = [];
  for (let i = 0; i < 8; i++) {
    const d = addDays(sundayBefore, i);
    days.push({
      date: d,
      dayName: format(d, 'EEE'), // "Sun", "Mon", "Tue"...
      dayNumber: format(d, 'dd'), // "09", "10", "11"...
      isToday: isToday(d),
      isoString: d.toISOString(),
    });
  }
  return days;
};

/**
 * Format readable time from startTime/endTime or fallback to dueAt
 */
export const formatTaskTime = (startTime, endTime, dueAt) => {
  if (startTime && endTime) {
    return `${startTime} - ${endTime}`;
  }
  if (startTime) {
    return startTime;
  }
  if (dueAt) {
    const d = typeof dueAt === 'string' ? parseISO(dueAt) : dueAt;
    return format(d, 'hh:mm a');
  }
  return '';
};

export { isSameDay, isToday, isThisWeek, parseISO, startOfWeek, endOfWeek };
