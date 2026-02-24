import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Subscription name is required'],
      trim: true,
      maxLength: [100, 'Name cannot exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['INR','USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
    },
    frequency: {
      type: String,
      required: [true, 'Billing frequency is required'],
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
      type: String,
      default: 'other',
      enum: ['streaming','productivity','gaming','news','fitness','cloud','software','education','other'],
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'paused', 'cancelled'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    nextBillingDate: {
      type: Date,
    },
    notes: {
      type: String,
      maxLength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// Promise-based pre hook — no next callback
subscriptionSchema.pre('save', async function () {
  if (this.isModified('startDate') || this.isModified('frequency') || this.isNew) {
    const date = new Date(this.startDate);
    switch (this.frequency) {
      case 'daily':   date.setDate(date.getDate() + 1); break;
      case 'weekly':  date.setDate(date.getDate() + 7); break;
      case 'monthly': date.setMonth(date.getMonth() + 1); break;
      case 'yearly':  date.setFullYear(date.getFullYear() + 1); break;
    }
    this.nextBillingDate = date;
  }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;