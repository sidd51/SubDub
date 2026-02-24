import cron from 'node-cron';
import { sendUpcomingRemainders } from '../utils/remainder.service.js';

//Run every day at 9:00 AM 
export const startRemainderJob =()=>{
  cron.schedule(' 0 9 * * *', async()=>{
    console.log('Running reminder job...');

    try {
      await sendUpcomingRemainders();
    } catch (err) {
      console.error('Cron error:', err);
    }
  });
};