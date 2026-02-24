import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../config/nodemailer.js";


export const sendUpcomingRemainders =async() =>{
  const today =new Date();
  const tomorrow= new Date();
  tomorrow.setDate(today.getDate()+1);

  const subs =await Subscription.find({
     status: 'active',
    nextBillingDate: {
      $gte: today,
      $lte: tomorrow,
    },
  }).populate('user');

  for (const sub of subs) {
    await sendEmail({
      to: sub.user.email,
      subject: `Reminder: ${sub.name} expires soon`,
      html: `
  <div style="font-family: 'Segoe UI', sans-serif; background:#f7f6f3; padding:30px;">
    
    <div style="max-width:520px; margin:auto; background:white; border-radius:12px; padding:28px; box-shadow:0 8px 24px rgba(0,0,0,0.06);">
      
      <!-- Header -->
      <div style="text-align:center; margin-bottom:20px;">
        <h2 style="margin:0; color:#2e2e2e;">🔔 SubDub Reminder</h2>
        <p style="font-size:13px; color:#888; margin-top:6px;">
          Stay on top of your subscriptions
        </p>
      </div>

      <!-- Main Message -->
      <h3 style="color:#333; margin-bottom:12px;">
        Your ${sub.name} subscription is renewing soon
      </h3>

      <p style="color:#555; font-size:14px; line-height:1.6;">
        Just a heads up — your subscription for 
        <strong>${sub.name}</strong> is scheduled to renew 
        <strong>tomorrow</strong>.
      </p>

      <!-- Info Box -->
      <div style="margin:20px 0; padding:16px; background:#f3f7f4; border-radius:10px;">
        <p style="margin:6px 0; font-size:14px;">
          💳 <strong>Amount:</strong> ${sub.currency} ${sub.price}
        </p>
        <p style="margin:6px 0; font-size:14px;">
          📅 <strong>Billing Date:</strong> ${new Date(sub.nextBillingDate).toDateString()}
        </p>
      </div>

      <!-- CTA -->
      <p style="font-size:14px; color:#555;">
        You can manage this subscription anytime in your dashboard.
      </p>

      <!-- Footer -->
      <div style="margin-top:24px; font-size:12px; color:#999; text-align:center;">
        <p>You're receiving this because you're tracking subscriptions on SubDub.</p>
        <p style="margin-top:4px;">© ${new Date().getFullYear()} SubDub</p>
      </div>

    </div>
  </div>
`
    });
  }
  console.log(`Reminders sent: ${subs.length}`);
}