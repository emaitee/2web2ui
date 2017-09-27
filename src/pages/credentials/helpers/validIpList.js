import { trim } from 'lodash';
import { ipRegex } from 'helpers/regex';

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
