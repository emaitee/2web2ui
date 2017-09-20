import { trim } from 'lodash';

const ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;

export default function validIpList(value) {
  if (!value) {
    return;
  }

  const ips = value.split(',').map(trim);
  const invalidIps = ips.filter((ip) => !ipRegex.test(ip));

  if (invalidIps.length) {
    return 'Must be a comma separated list of valid IPs';
  }
}
