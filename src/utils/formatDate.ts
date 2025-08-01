/**
 * Format a date to a human-readable string
 * 
 * @param date - Date string, Date object, or timestamp to format
 * @param options - Optional format options
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | number | undefined, 
  options: { 
    includeTime?: boolean;
    dateStyle?: Intl.DateTimeFormatOptions['dateStyle'];
  } = {}
): string {
  if (!date) return 'Not available';

  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const { includeTime = false, dateStyle = 'medium' } = options;
    
    const dateFormatOptions: Intl.DateTimeFormatOptions = {
      dateStyle,
    };
    
    if (includeTime) {
      dateFormatOptions.timeStyle = 'short';
    }
    
    return new Intl.DateTimeFormat('en-US', dateFormatOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error formatting date';
  }
}