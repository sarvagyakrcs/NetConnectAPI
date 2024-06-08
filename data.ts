import { daysToSeconds, hoursToSeconds, minutesToSeconds } from "./src/utils/helper";

/**
 * Expiration time for the verification token, in seconds.
 * @constant {number}
 */
export const VERIFICATION_TOKEN_EXPIRE_TIME: number = minutesToSeconds(15); // 15 minutes

/**
 * Expiration time for the refresh token, in seconds.
 * @constant {number}
 */
export const REFRESH_TOKEN_EXPIRE_TIME: number = daysToSeconds(7); // 1 week
