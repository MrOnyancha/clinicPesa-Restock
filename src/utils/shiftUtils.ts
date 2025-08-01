/**
 * Utility functions for managing shift-related operations
 */

/**
 * Check if a shift is currently active based on localStorage data
 * @returns {boolean} True if a shift is active, false otherwise
 */
export const isShiftActive = (): boolean => {
  const shiftData = localStorage.getItem('shiftStatus');
  if (!shiftData) return false;
  
  try {
    const { active } = JSON.parse(shiftData);
    return active === true;
  } catch (error) {
    console.error('Error parsing shift status:', error);
    return false;
  }
};

/**
 * Get the current shift ID if a shift is active
 * @returns {string|null} Shift ID if active, null otherwise
 */
export const getActiveShiftId = (): string | null => {
  if (!isShiftActive()) return null;
  return localStorage.getItem('shiftId');
};
