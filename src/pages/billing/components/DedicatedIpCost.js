import config from 'src/config';

export default function DedicatedIpCost({ plan, quantity }) {
  return plan.isAwsAccount
    ? `$${(config.sendingIps.awsPricePerIp * quantity).toFixed(3)} per hour`
    : `$${(config.sendingIps.pricePerIp * quantity).toFixed(2)} per month`;
}