/**
 * Utility functions for formatting data in the ClinicPesa Restocking Project
 */

/**
 * Converts a timestamp in milliseconds to a formatted date string
 * @param timestamp - Unix timestamp in milliseconds (e.g., 1738241492732)
 * @returns Formatted date string in DD-MM-YYYY format with time (e.g., "18-03-2025 03:06 PM")
 */
export const formatTimestamp = (timestamp: number): string => {
  // Create a new Date object from the timestamp
  const date = new Date(timestamp);

  // Get date components
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();

  // Get time components
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Determine AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12 for 12 AM
  const hoursStr = hours.toString().padStart(2, '0');

  // Format the complete date string
  return `${day}-${month}-${year} ${hoursStr}:${minutes} ${ampm}`;
};

/**
 * Formats a number as currency with comma thousands separators
 * @param value - The number to format (e.g., 175005.00)
 * @param removeDecimals - Whether to remove decimal places (default: true)
 * @returns Formatted string with commas (e.g., "175,005")
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  removeDecimals: boolean = true
): string => {
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0';
  }

  if (removeDecimals) {
    return Math.round(numValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

/**
 * Converts a timestamp to a relative time (e.g., "2 days ago", "just now")
 * @param timestamp - Unix timestamp in milliseconds
 * @returns A string representing the relative time
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  // For older dates, return the formatted date
  return formatTimestamp(timestamp);
};
