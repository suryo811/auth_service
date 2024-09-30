import User from "../models/userModel.js"
import AppError from '../utils/appError.js'
import asyncHandler from "../utils/asyncHandler.js"
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"

const register = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //checking for duplicate email in controller too, as setting up unique:true is not a validator
    const emailAlreadyExists = await User.findOne({ email })
    if (emailAlreadyExists) {
        throw new AppError('Email already exists', 400);
    }

    const user = await User.create({ email, password })

    res.status(201).json({ user })

})

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('please provide email and password', 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError('invalid credentials', 401)
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new AppError('invalid credentials', 401)
    }

    //token generation
    const accessToken = generateAccessToken({ userId: user._id, role: user.role })
    const refreshToken = generateRefreshToken({ userId: user._id })

    user.refreshToken = refreshToken;
    await user.save()

    res
        .status(200)

        .json({ email: user.email, accessToken: accessToken, refreshToken: user.refreshToken })

})

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    const accessToken = req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return res.status(401).json({
            valid: false,
            message: 'Invalid authentication: No token provided'
        });
    }

    try {
        const { userId, role } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        // Send success response with user data
        return res.status(200).json({
            valid: true,
            data: { userId, role }
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                valid: false,
                message: 'Token has expired',
                expiredAt: error.expiredAt // Provide when the token expired
            });
        }
    }

    // For any other error (invalid token, etc.)
    return res.status(401).json({
        valid: false,
        message: 'Invalid authentication: Invalid token'
    });
})


export { register, login, verifyAccessToken }

