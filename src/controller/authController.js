import User from "../models/userModel.js"
import AppError from '../utils/appError.js'
import asyncHandler from "../utils/asyncHandler.js"
import jwt from 'jsonwebtoken'

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

    res.status(200).json({ user })


})


export { register, login }

