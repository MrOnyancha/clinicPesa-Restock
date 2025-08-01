/**
 * Formats a date string into a human-readable format
 * @param dateString The date string to format
 * @param options Intl.DateTimeFormatOptions
 * @returns A formatted date string
 */
export const formatDate = (
  dateString: string, 
  options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }
): string => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return '-';
  }
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Formats a date to show time since (e.g. "2 days ago")
 * @param dateString The date string to format
 * @returns A relative time string
 */
export const getTimeSince = (dateString: string): string => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return '-';
  }
  
  const now = new Date();
  const secondsPast = (now.getTime() - date.getTime()) / 1000;
  
  if (secondsPast < 60) {
    return 'Just now';
  }
  
  if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  if (secondsPast < 604800) {
    const days = Math.floor(secondsPast / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  const weeks = Math.floor(secondsPast / 604800);
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
};

/**
 * Formats a date into an ISO string for form inputs
 * @param date A Date object or string
 * @returns A formatted date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
