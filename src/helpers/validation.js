import _ from 'lodash';
import { emailRegex, emailLocalRegex, domainRegex } from './regex';

export function required(value) {
  return value ? undefined : 'Required';
}

export function email(value) {
  return emailRegex.test(value) ? undefined : 'Invalid Email';
}

export function emailLocal(value) {
  return emailLocalRegex.test(value) ? undefined : 'Invalid Email';
}

export function domain(value) {
  return domainRegex.test(value) ? undefined : 'Invalid Domain';
}

export const maxLength = _.memoize(function maxLength(length) {
  return (value) => (value && value.length > length) ? `Must be ${length} characters or less` : undefined;
});
