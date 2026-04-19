import { GOALS_STORAGE_KEY, DEFAULT_GOAL_SETTINGS } from '../constants';

/**
 * Reads goal settings from localStorage.
 * @returns {Object} Stored settings or DEFAULT_GOAL_SETTINGS.
 */
export const getGoalSettings = () => {
  try {
    const settings = localStorage.getItem(GOALS_STORAGE_KEY);
    return settings ? JSON.parse(settings) : DEFAULT_GOAL_SETTINGS;
  } catch (error) {
    console.error('Error reading goal settings from localStorage', error);
    return DEFAULT_GOAL_SETTINGS;
  }
};

/**
 * Validates and saves goal settings to localStorage.
 * @param {Object} settings - Settings to save.
 * @returns {Object} The saved settings object.
 * @throws {Error} If validation fails.
 */
export const saveGoalSettings = (settings) => {
  const { capital, targetPercent, year } = settings;

  // Validation
  if (!capital || capital <= 0) {
    throw new Error('Capital must be greater than 0');
  }
  if (!targetPercent || targetPercent <= 0) {
    throw new Error('Target percent must be greater than 0');
  }
  if (!year || typeof year !== 'number' || year < 2020 || year > 2030) {
    throw new Error('Year must be a 4-digit number between 2020 and 2030');
  }

  const mergedSettings = {
    ...DEFAULT_GOAL_SETTINGS,
    ...settings,
  };

  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(mergedSettings));
    return mergedSettings;
  } catch (error) {
    console.error('Error saving goal settings to localStorage', error);
    throw error;
  }
};

/**
 * Removes goal settings from localStorage.
 */
export const clearGoalSettings = () => {
  try {
    localStorage.removeItem(GOALS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing goal settings from localStorage', error);
  }
};
