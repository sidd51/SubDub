export const getComputedStatus = (sub) => {
  const now = new Date();

  // User intent overrides everything
  if (sub.status === 'cancelled') return 'cancelled';
  if (sub.status === 'paused') return 'paused';

  // Time-based condition
  if (sub.nextBillingDate && sub.nextBillingDate < now) {
    return 'expired';
  }

  return 'active';
};