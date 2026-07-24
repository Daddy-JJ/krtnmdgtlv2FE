export function validatePlanCode(value) {
  return value === 'basic' || value === 'pro' ? '' : 'Pilih paket Basic atau Pro.';
}

export function billingStatusLabel(status) {
  return ({
    pending: 'Pending',
    paid: 'Successful',
    failed: 'Failed',
    expired: 'Expired',
    canceled: 'Canceled',
    refunded: 'Refunded',
  })[status] ?? 'Unknown';
}
