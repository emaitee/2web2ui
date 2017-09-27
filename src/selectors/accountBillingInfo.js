export default function({ account }) {
  const { billing, subscription } = account;

  return {
    hasBillingAccount: !!billing,
    ...subscription
  }
}
