import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD, EMAIL_USER } from './env.js'
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass:EMAIL_PASSWORD
  },
});

export const  sendEmail =async ({ to, subject, html}) =>{
  const mailOptions= {
    from: `"SubDub" <siddhiborawake7@gmail.com>`,
    to,
    subject,
    html,  
  };
  await transporter.sendMail(mailOptions);
};
