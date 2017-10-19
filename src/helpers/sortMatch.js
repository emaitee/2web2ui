import _ from 'lodash';
const identity = (a) => a;

export function basicScorer(haystack, needle) {
  // console.log(`sorting ${haystack} vs ${needle}`) // eslint-disable-line
  if (needle.length > haystack.length) {
    return 0;
  }

  // case-sensitive exact match
  if (haystack === needle) {
    return 10;
  }

  const lcHaystack = haystack.toLowerCase();
  const lcNeedle = needle.toLowerCase();

  // case-insensitive exact match
  if (lcHaystack === lcNeedle) {
    return 9;
  }

  // starts with case-sensitive needle
  if (haystack.startsWith(needle)) {
    return 8;
  }

  // starts with case-insensitive needle
  if (lcHaystack.startsWith(lcNeedle)) {
    return 7;
  }

  // word starts with needle, e.g. something needle
  const afterSpace = lcHaystack.includes(` ${lcNeedle}`);
  if (afterSpace) {
    return 6;
  }

  // needle found after - or _ e.g. something-needle
  const afterDash = lcHaystack.includes(`-${lcNeedle}`);
  const afterUnderscore = lcHaystack.includes(`_${lcNeedle}`);
  if (afterDash || afterUnderscore) {
    return 5;
  }

  // 3-character needle contained in haystack at all
  if (lcNeedle.length > 2 && lcHaystack.includes(lcNeedle)) {
    return 4;
  }

  return 0;
}

export function filterAndSortByScore(list) {
  return list.filter(([score]) => score > 0)
    .sort((a, b) => b[0] - a[0])
    .map(([score, item]) => item);
}

export default function sortMatch(items, pattern, getter = identity) {
  const scoredItems = items.map((item) => {
    const haystack = getter(item);
    const score = basicScorer(haystack, pattern);
    return [score, item];
  });
  return filterAndSortByScore(scoredItems);
}

export function objectScorer(item, objectPattern) {
  const keys = _.intersection(Object.keys(item), Object.keys(objectPattern));
  return keys.reduce((score, key) => score + basicScorer(item[key], objectPattern[key]), 0);
}

// TODO: should we memoize somehow?
// TODO: key translation to not force people to know key returned by API (e.g. short_key vs key, label vs name)
export function objectSortMatch({ items, pattern, objectPattern, getter }) {
  if (objectPattern && Object.keys(objectPattern)) {
    const scoredItems = items.map((item) => {
      const score = objectScorer(item, objectPattern) || basicScorer(getter(item), pattern);
      return [score, item];
    });
    return filterAndSortByScore(scoredItems);
  }

  return sortMatch(items, pattern, getter);
}

const objectPatternRegex = /([^\s]+:[^\s"]+)/g;
const objectPatternExactRegex = /([^\s]+):"([^"]+)"/g;
const enclosingQuotesRegex = /^"?([^"]+)"?$/;

/**
 * Converts a list of colon-separated pairs
 * into a key/value hash
 * @param {Array} list
 *
 */
function convertPairsToHash(list = []) {
  const split = list.map((m) => m.split(':'));
  const keys = split.map((m) => m[0]);
  const values = split.map((m) => m[1].replace(enclosingQuotesRegex, '$1'));
  return _.zipObject(keys, values);
}

/**
 * Takes a string like ->
 * something first:thing another:"thing with spaces"
 *
 * and returns ->
 * {
 *   first: "thing",
 *   another: "thing with spaces"
 * }
 * @param {String} string
 */
export const getObjectPattern = _.memoize((string) => {
  const matches = string.match(objectPatternRegex) || [];
  const exactMatches = string.match(objectPatternExactRegex) || [];

  if (!matches.length && !exactMatches.length) {
    return {};
  }

  return convertPairsToHash([ ...matches, ...exactMatches ]);
});
