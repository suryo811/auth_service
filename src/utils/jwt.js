import jwt from 'jsonwebtoken';

const generateAccessToken = (userObj) => {
    return jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXP });
}

const generateRefreshToken = (userObj) => {
    return jwt.sign(userObj, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXP });
}

export { generateAccessToken, generateRefreshToken }