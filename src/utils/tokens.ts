import { v4 as uuidv4 } from 'uuid';
import { REFRESH_TOKEN_EXPIRE_TIME, VERIFICATION_TOKEN_EXPIRE_TIME } from '../../data';
import { getRefreshTokenByEmail, getVerificationTokenByEmail } from './data/token';
import db from './prisma';
import { get_user_by_email } from './data/users';
const jwt = require("jsonwebtoken")

const AUTH_SECRET = process.env.AUTH_SECRET;
const prisma = db;

/**
 * Interface representing the data structure of a token.
 * @interface TokenData
 * @property {string} jti - Unique token identifier.
 * @property {string} [iss] - Issuer of the token.
 * @property {string} [sub] - Subject of the token.
 * @property {string} [aud] - Audience of the token.
 * @property {number} exp - Expiration time of the token (seconds since epoch).
 * @property {number} iat - Issued at time of the token (seconds since epoch).
 * @property {string} role - Role of the user.
 * @property {string} email - Email of the user.
 * @property {string} user_name - Username of the user.
 */
interface TokenData {
    jti: string;
    iss?: string;
    sub?: string;
    aud?: string;
    exp: number;
    iat: number;
    role: string;
    email: string;
    user_name: string;
}

/**
 * Generates a verification token for the specified email address.
 * @param {string} email - The email address for which to generate the verification token.
 * @returns {Promise<any>} A promise that resolves to the generated verification token or null if an error occurs.
 */
export const generateVerificationToken = async (email: string): Promise<any> => {
    const expires = Math.floor(Date.now() / 1000) + VERIFICATION_TOKEN_EXPIRE_TIME;
    const issued_at = Math.floor(Date.now() / 1000);
    const jti = uuidv4();

    const existing_token = await getVerificationTokenByEmail(email);
    if (existing_token) {
        await db.verificationToken.delete({
            where: {
                id: existing_token.id
            }
        });
    }

    const existingUser = await get_user_by_email(email);
    if (!existingUser || !existingUser.email || !existingUser.user_name) {
        return null;
    }

    const payload: TokenData = {
        jti: jti,
        exp: expires,
        iat: issued_at,
        role: existingUser.role,
        email: existingUser.email,
        user_name: existingUser.user_name
    };

    try {
        const token = await new Promise<string>((resolve, reject) => {
            jwt.sign(payload, AUTH_SECRET, { algorithm: 'HS256' }, (err: Error, token: string | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token as string);
                }
            });
        });

        const created_token = await prisma.verificationToken.create({
            data: {
                email: email,
                expires: new Date(expires * 1000),
                token: token,
                jti: jti
            }
        });
        return created_token;
    } catch (error) {
        console.error("Error generating token:", error);
        return null;
    }
};

/**
 * Generates a refresh token for the specified email address.
 * @param {string} email - The email address for which to generate the refresh token.
 * @returns {Promise<any>} A promise that resolves to the generated refresh token.
 */
// export const generateRefreshToken = async (email: string): Promise<any> => {
//     const token = uuidv4();
//     const expires = new Date(new Date().getTime() + REFRESH_TOKEN_EXPIRE_TIME * 1000);

//     const existing_token = await getRefreshTokenByEmail(email);
//     if (existing_token) {
//         await db.refreshToken.delete({
//             where: {
//                 id: existing_token.id
//             }
//         });
//     }

//     const refreshToken = await db.refreshToken.create({
//         data: {
//             email: email,
//             expires: expires,
//             token: token
//         }
//     });

//     return refreshToken;
// };

export const generateRefreshToken = async (email: string): Promise<any> => {
    const expires = Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRE_TIME;
    const issued_at = Math.floor(Date.now() / 1000);
    const jti = uuidv4();

    const existing_token = await getRefreshTokenByEmail(email);
    if (existing_token) {
        await db.refreshToken.delete({
            where: {
                id: existing_token.id
            }
        });
    }

    const existingUser = await get_user_by_email(email);
    if (!existingUser || !existingUser.email || !existingUser.user_name) {
        return null;
    }

    const payload: TokenData = {
        jti: jti,
        exp: expires,
        iat: issued_at,
        role: existingUser.role,
        email: existingUser.email,
        user_name: existingUser.user_name
    };

    try {
        const token = await new Promise<string>((resolve, reject) => {
            jwt.sign(payload, AUTH_SECRET, { algorithm: 'HS256' }, (err: Error, token: string | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token as string);
                }
            });
        });

        const created_token = await prisma.refreshToken.create({
            data: {
                email: email,
                expires: new Date(expires * 1000),
                token: token,
                jti: jti
            }
        });
        return created_token;
    } catch (error) {
        console.error("Error generating token:", error);
        return null;
    }
};


export const deleteRefreshToken = async (email: string): Promise<any> => {
    const existing_token = await getRefreshTokenByEmail(email);
    if (existing_token) {
        await db.refreshToken.delete({
            where: {
                id: existing_token.id
            }
        });
        return {
            success: "Refresh Token Deleted Successfully"
        }
    }
    return null;
};

export const deleteAccessToken = async (email: string): Promise<any> => {
    const existing_token = await getVerificationTokenByEmail(email);
    if (existing_token) {
        await db.verificationToken.delete({
            where: {
                id: existing_token.id
            }
        });
        return {
            success: "Access Token Deleted Successfully"
        }
    }
    return null;
};