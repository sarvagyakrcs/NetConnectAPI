import db from "../prisma";
const prisma = db;

/**
 * Retrieves the verification token associated with the specified email.
 * @param {string} email - The email address to search for.
 * @returns {Promise<any>} A promise that resolves to the verification token, or null if not found.
 */
export const getVerificationTokenByEmail = async (email: string): Promise<any> => {
    try {
        const verificationToken = db.verificationToken.findFirst({
            where: {
                email: email
            }
        });
        return verificationToken;
    } catch (error) {
        return null;
    }
}

/**
 * Retrieves the refresh token associated with the specified email.
 * @param {string} email - The email address to search for.
 * @returns {Promise<any>} A promise that resolves to the refresh token, or null if not found.
 */
export const getRefreshTokenByEmail = async (email: string): Promise<any> => {
    try {
        const refreshToken = db.refreshToken.findFirst({
            where: {
                email: email
            }
        });
        return refreshToken;
    } catch (error) {
        return null;
    }
}
