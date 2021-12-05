import { isNumber } from '../../utils/utils';

describe('basic utilities', () => {
  describe('isNumber', () => {
    const scenarios: [
      Parameters<typeof isNumber>[0],
      ReturnType<typeof isNumber>,
    ][] = [
      [0, true],
      [-999, true],
      [999, true],
      [Infinity, true],
      [Number.MIN_VALUE, true],
      [null, false],
      [undefined, false],
      ['', false],
      ['asd', false],
      [{}, false],
      [() => null, false],
    ];

    it.each(scenarios)('input: %d, is a number: %s', (input, output) => {
      expect(isNumber(input)).toEqual(output);
    });
  });
});
