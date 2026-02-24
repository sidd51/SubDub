import Subscription from '../models/subscription.model.js';
import { getComputedStatus } from '../utils/subscriptionStatus.js';
//Helper 
const addCycle = (date, frequency) => {
  const d = new Date(date);

  switch (frequency) {
    case 'daily': d.setDate(d.getDate() + 1); break;
    case 'weekly': d.setDate(d.getDate() + 7); break;
    case 'monthly': d.setMonth(d.getMonth() + 1); break;
    case 'yearly': d.setFullYear(d.getFullYear() + 1); break;
  }

  return d;
};

// ─── POST /api/v1/subscriptions ───────────────────────────────────────────────
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Subscription created', data: subscription });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/subscriptions ────────────────────────────────────────────────


export const getMySubscriptions = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const subscriptions = await Subscription.find(filter).sort({
      nextBillingDate: 1,
    });

    const enriched = subscriptions.map((sub) => ({
      ...sub.toObject(),
      computedStatus: getComputedStatus(sub),
    }));

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/subscriptions/:id ───────────────────────────────────────────
export const getSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!sub) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...sub.toObject(),
        computedStatus: getComputedStatus(sub),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/v1/subscriptions/:id ───────────────────────────────────────────
export const updateSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne(
      { _id: req.params.id,
        user: req.user._id 
      },
      
    );

    if (!sub) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    const {name, category, notes} =req.body;

    if(name) sub.name= name;
    if (category) sub.category = category;
    if (notes) sub.notes = notes;

    await sub.save();
    res.status(200).json({ success: true, message: 'Subscription updated', data: sub });
  } catch (error) {
    next(error);
  }
};

//------------------CANCLE-------------------------------//
export const cancelSubscription =async (req,res, next)=>{
  try{
    const sub= await Subscription.findOne(
      { _id: req.params.id,  
        user: req.user._id,
      }
    );
    if(!sub) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    sub.status= "cancelled";
    await sub.save();
    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (err) {
    next(err);
  }

};


//-----------------------PAUSE--------------------------------------------//
export const pauseSubscription =async(req,res,next)=>{
  try{
    const sub= await Subscription.findOne({
      _id: req.params.id,  
      user: req.user._id,
    });

    if (!sub) return res.status(404).json({ message: 'Not found' });

    sub.status = 'paused';

    await sub.save();

    res.json({ success: true, message: 'Subscription paused' });
  } catch (err) {
    next(err);
  }
};
//----------------------RESUME----------------------------------------------------//
export const resumeSubscription=async (req,res,next)=>{
  try{
    const sub=await Subscription.findOne({
      _id: req.params.id,  
      user: req.user._id
    });
   if (!sub) return res.status(404).json({ message: 'Not found' });

    sub.status = 'active';

    await sub.save();

    res.json({ success: true, message: 'Subscription resumed' });
  } catch (err) {
    next(err);
  }
};
//-----------------RENEW--------------------------//
export const renewSubscription=async (req,res,next)=>{
  try{
    const sub=await Subscription.findOne({
      _id: req.params.id,
      user: req.user._id
    });
   if (!sub) return res.status(404).json({ message: 'Not found' });

    if(sub.status === 'cancelled'){
       return res.status(400).json({  
        success: false,
        message: 'Cannot renew a cancelled subscription', });
    }
    const now=new Date();
    const baseDate=
        sub.nextBillingDate && sub.nextBillingDate> now
        ? sub.nextBillingDate 
        : now;
    
    //Move forward
     sub.nextBillingDate = addCycle(baseDate, sub.frequency);

    await sub.save();

    res.json({ success: true, message: 'Subscription resumed' });
  } catch (err) {
    next(err);
  }
};


//-----------------------------------------CHANGE PLAN------------------------------------------------//
export const changePlan = async (req, res, next) => {
  try {
    const { frequency } = req.body;

    const allowedFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];

    if (!allowedFrequencies.includes(frequency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid frequency',
      });
    }

    const sub = await Subscription.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!sub) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    //Cannot change plan if cancelled
    if (sub.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change plan of a cancelled subscription',
      });
    }

    // No change
    if (sub.frequency === frequency) {
      return res.status(400).json({
        success: false,
        message: 'Already on this plan',
      });
    }

    //Apply change
    sub.frequency = frequency;

    // Reset billing cycle from NOW
    const now = new Date();
    sub.startDate = now;
    sub.nextBillingDate = addCycle(now, frequency);

    await sub.save();

    res.status(200).json({
      success: true,
      message: 'Plan changed successfully',
      data: sub,
    });
  } catch (error) {
    next(error);
  }
};


// ─── DELETE /api/v1/subscriptions/:id ────────────────────────────────────────
export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    res.status(200).json({ success: true, message: 'Subscription deleted' });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/subscriptions/stats ─────────────────────────────────────────
export const getStats = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({
      user: req.user._id,
      status: 'active',
    });

    // Approximate conversion rates to INR
    const TO_INR = {
      INR: 1,
      USD: 85,
      EUR: 92,
      GBP: 108,
      JPY: 0.57,
      CAD: 62,
      AUD: 54,
    };

    // Convert price to INR then normalize to monthly
    const toMonthlyINR = (price, currency, frequency) => {
      const inrPrice = price * (TO_INR[currency] || 1);
      switch (frequency) {
        case 'daily':   return inrPrice * 30;
        case 'weekly':  return inrPrice * 4.33;
        case 'monthly': return inrPrice;
        case 'yearly':  return inrPrice / 12;
        default:        return inrPrice;
      }
    };

    let totalMonthly = 0;
    const byCategory = {};

    subscriptions.forEach((sub) => {
      const monthly = toMonthlyINR(sub.price, sub.currency, sub.frequency);
      totalMonthly += monthly;

      if (!byCategory[sub.category]) byCategory[sub.category] = 0;
      byCategory[sub.category] += monthly;
    });

    res.status(200).json({
      success: true,
      data: {
        activeCount: subscriptions.length,
        totalMonthly: parseFloat(totalMonthly.toFixed(2)),
        totalYearly: parseFloat((totalMonthly * 12).toFixed(2)),
        byCategory: Object.fromEntries(
          Object.entries(byCategory).map(([k, v]) => [k, parseFloat(v.toFixed(2))])
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/subscriptions/upcoming ──────────────────────────────────────
export const getUpcoming = async (req, res, next) => {
  try {
    const today = new Date();
    const in7Days = new Date();
    in7Days.setDate(today.getDate() + 7);

    const upcoming = await Subscription.find({
      user: req.user._id,
      status: 'active',
      nextBillingDate: { $gte: today, $lte: in7Days },
    }).sort({ nextBillingDate: 1 });

    res.status(200).json({
      success: true,
      count: upcoming.length,
      data: upcoming,
    });
  } catch (error) {
    next(error);
  }
};

