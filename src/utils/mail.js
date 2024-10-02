import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

// Create a nodemailer transporter instance which is responsible to send a mail
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


async function mail({ to, subject, html }) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"no-reply" <testing@suryo.dev>', // sender address
        to,
        subject,
        html
    });
    console.log("Message sent: %s", info.messageId);
}

export default mail