import User from '../models/userModel.js'
import AppError from '../utils/appError.js'
import asyncHandler from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js'

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
        throw new AppError('Invalid authentication: No token provided', 400);
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
            throw new AppError('Token expired', 401)
        }
        // For any other error (invalid token, etc.)
        throw new AppError('Invalid authentication: Invalid token', 401)
    }

})


const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingRefreshToken) {
        throw new AppError('Invalid authentication: No token provided', 400);
    }

    try {
        const { userId } = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(userId);

        if (!user) {
            throw new AppError("Invalid refresh token", 401)
        }

        //check if incoming refresh token is used
        //If it is used, then replace it with a new one
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new AppError("Refresh token is expired or used", 401) //prompt re-login
        }

        // Generate new access and refresh token
        const newAccessToken = generateAccessToken({ userId: user._id, role: user.role })
        const newRefreshToken = generateRefreshToken({ userId: user._id })

        // Update the user's refresh token in the database
        user.refreshToken = newRefreshToken;
        await user.save();

        return res.status(200).json({ msg: 'Access token refreshed successfully', accessToken: newAccessToken, refreshToken: newRefreshToken, })

    } catch (error) {
        throw new AppError('Invalid refresh token', 401);
    }

})

export { register, login, verifyAccessToken, refreshAccessToken }

