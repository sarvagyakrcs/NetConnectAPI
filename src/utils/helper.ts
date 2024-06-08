/**
 * Converts minutes to seconds.
 * @param {number} minutes - The number of minutes to convert.
 * @returns {number} The equivalent number of seconds.
 */
export const minutesToSeconds = (minutes: number): number => {
    return minutes * 60;
}

/**
 * Converts hours to seconds.
 * @param {number} hours - The number of hours to convert.
 * @returns {number} The equivalent number of seconds.
 */
export const hoursToSeconds = (hours: number): number => {
    return hours * 3600;
}

/**
 * Converts days to seconds.
 * @param {number} days - The number of days to convert.
 * @returns {number} The equivalent number of seconds.
 */
export const daysToSeconds = (days: number): number => {
    return days * 24 * 3600;
}
