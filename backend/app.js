import express from 'express'
import {PORT} from './config/env.js'
import  cookieParser from 'cookie-parser'

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js'
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import { startRemainderJob } from './cron/remainder.cron.js';

import cors from 'cors';


const app=express();

app.use(cors({
  origin: 'https://sub-dub.vercel.app',
  credentials: true
}));

//inbuilt express middlewares
app.use(express.json()); //allows us to handle json data in requests
app.use(express.urlencoded({extended: false}));//process the form data sent from html forms
app.use(cookieParser())//read cookies from request so app can store user data
app.use(arcjetMiddleware)

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(errorMiddleware);

app.get('/', (req,res)=>{
  res.send("Welcome to the Subscription Tracker AP!!");
});

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    startRemainderJob();
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

startServer();