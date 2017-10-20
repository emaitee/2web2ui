import sortMatch, { objectSortMatch, getObjectPattern } from '../sortMatch';
import * as scorers from '../sortMatchScorers';

describe('Helper: sortMatch', () => {

  beforeEach(() => {
    scorers.basicScorer = jest.fn();
    scorers.objectScorer = jest.fn();
    scorers.basicScorer.mockReturnValue(0);
    scorers.objectScorer.mockReturnValue(0);
  });

  it('should filter and sort by basic score', () => {
    scorers.basicScorer
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(8);

    const result = sortMatch(['a', 'b', 'c', 'd', 'e'], 'test pattern');
    expect(scorers.basicScorer).toHaveBeenCalledTimes(5);
    expect(result).toEqual(['b', 'a']);
  });

  it('should call a custom getter for every item', () => {
    const getter = jest.fn(() => 'a');
    sortMatch([1, 2, 3, 4, 5], 'test-pattern', getter);
    expect(getter).toHaveBeenCalledTimes(5);
  });

  describe('objectSortMatch', () => {

    beforeEach(() => {
      scorers.basicScorer
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(8);
    });

    it('should filter and sort results when an object pattern is present', () => {
      const result = objectSortMatch({
        items: [{ a: 1 }, { a: 2 }, { a: 3 }],
        pattern: 'key:value',
        getter: (item) => item.a
      });
      expect(scorers.basicScorer).toHaveBeenCalledTimes(3);
      expect(scorers.objectScorer).toHaveBeenCalledTimes(3);
      expect(result).toEqual([{ a: 2 }, { a: 1 }]);
    });

    it('should filter and sort results when no object pattern is present', () => {
      const result = objectSortMatch({
        items: [{ a: 1 }, { a: 2 }, { a: 3 }],
        pattern: 'value',
        getter: (item) => item.a
      });
      expect(scorers.basicScorer).toHaveBeenCalledTimes(3);
      expect(scorers.objectScorer).toHaveBeenCalledTimes(0);
      expect(result).toEqual([{ a: 2 }, { a: 1 }]);
    });

    it('should skip the basic scorer if object score is above 0', () => {
      scorers.basicScorer.mockReset();
      scorers.basicScorer.mockReturnValue(0);
      scorers.objectScorer
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(7)
        .mockReturnValueOnce(10);

      const result = objectSortMatch({
        items: [{ a: 1 }, { a: 2 }, { a: 3 }],
        pattern: 'key:value',
        getter: (item) => item.a
      });

      expect(scorers.basicScorer).toHaveBeenCalledTimes(1);
      expect(scorers.objectScorer).toHaveBeenCalledTimes(3);
      expect(result).toEqual([{ a: 3 }, { a: 2 }]);
    });

  });

  describe('getObjectPattern', () => {

    it('should convert key:value pairs', () => {
      expect(getObjectPattern('whatever key:value name:bob')).toEqual({ key: 'value', name: 'bob' })
    });

    it('should convert exact matches wrapped in quotes', () => {
      expect(getObjectPattern('whatever key:"some value with spaces" other:"cool"'))
        .toEqual({ key: 'some value with spaces', other: 'cool' });
    });

    it('should return an empty object if no key:value pattern is found', () => {
      expect(getObjectPattern('no pairs here')).toEqual({});
    });

    it('should return the memoized cached version if the pattern stays the same', () => {
      const first = getObjectPattern('k:v');
      const second = getObjectPattern('k:v');
      expect(first).toBe(second);
    });

  });

});
