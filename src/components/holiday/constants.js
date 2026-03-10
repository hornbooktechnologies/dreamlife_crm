// Month names
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Day names
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Holiday types
export const HOLIDAY_TYPES = [
  { value: 'national', label: 'National Holiday' },
  { value: 'religious', label: 'Religious Holiday' },
  { value: 'company', label: 'Company Holiday' },
  { value: 'optional', label: 'Optional Holiday' },
];

// Get holiday type badge color
export const getHolidayTypeColor = (type) => {
  switch (type) {
    case 'national':
      return 'bg-green-100 text-green-700';
    case 'religious':
      return 'bg-purple-100 text-purple-700';
    case 'company':
      return 'bg-pink-100 text-pink-700';
    case 'optional':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Parse holiday date from API (UTC) to local timezone date parts
export const parseHolidayDate = (dateString) => {
  if (!dateString) return { year: 0, month: 0, day: 0, dateString: '' };

  // Create a Date object from the UTC string
  const utcDate = new Date(dateString);

  // Get local date parts (this automatically converts UTC to local timezone)
  const year = utcDate.getFullYear();
  const month = utcDate.getMonth(); // 0-indexed
  const day = utcDate.getDate();

  // Create a formatted date string for input fields (YYYY-MM-DD)
  const formattedDateString = `${year}-${String(month + 1).padStart(
    2,
    '0',
  )}-${String(day).padStart(2, '0')}`;

  return {
    year,
    month, // 0-indexed
    day,
    dateString: formattedDateString,
  };
};

// Format a date string for display in local timezone
export const formatHolidayDate = (dateString, options = {}) => {
  if (!dateString) return '';

  const utcDate = new Date(dateString);

  return utcDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
};
