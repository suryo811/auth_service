import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: [true, "email is required"],
        validate: {
            validator: validator.isEmail,
            message: 'please provide valid email address'
        }
    },

    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 6
    },

    role: {
        type: String,
        default: 'user',
        lowercase: true,
    },

    refreshToken: {
        type: String,
    },

    forgotPasswordToken: {
        type: String,
    },

    forgotPasswordExpiry: {
        type: Date,
    },

}, {
    timestamps: true
})

//pre-save hook
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10)
})

//instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

const User = mongoose.model("User", userSchema)
export default User



