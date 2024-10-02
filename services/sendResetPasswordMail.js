import mail from "../src/utils/mail.js";

const sendResetPasswordMail = async ({ token, origin, email }) => {

    const resetUrl = `${origin}/user/auth/reset-password?token=${token}&email=${email}`; //frontend url

    const message = `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2 style="color: #3C82F6;">Hello, </h2>
                <p style="font-size:18px">You requested to reset your password. Please reset your password by clicking the button below:</p>
                <p style="text-align: center;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #3C82F6; text-decoration: none; border-radius: 5px;">Reset Password</a>
                </p>
            </div> `


    return mail({
        to: email,
        subject: `Reset Password`,
        html: message
    })
}

export default sendResetPasswordMail