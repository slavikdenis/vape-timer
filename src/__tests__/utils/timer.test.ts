import {
  addZeroIfShortNumber,
  getDurationFromSeconds,
  getPhase,
  getPhaseLeftTime,
  getSecondsFromDuration,
  getWaveIndex,
  getWavePassedTime,
  roundNum,
} from '../../utils/timer';

describe('timer utilities', () => {
  describe('addZeroIfShortNumber', () => {
    const scenarios: [
      Parameters<typeof addZeroIfShortNumber>[0],
      ReturnType<typeof addZeroIfShortNumber>,
    ][] = [
      [0, '00'],
      [1, '01'],
      [9, '09'],
      [10, '10'],
      [999, '999'],
    ];

    it.each(scenarios)('input: %d, should produce: %s', (input, output) => {
      expect(addZeroIfShortNumber(input)).toEqual(output);
    });
  });

  describe('getDurationFromSeconds', () => {
    const scenarios: [
      Parameters<typeof getDurationFromSeconds>[0],
      ReturnType<typeof getDurationFromSeconds>,
    ][] = [
      [0, '00:00'],
      [1, '00:01'],
      [9, '00:09'],
      [10, '00:10'],
      [59, '00:59'],
      [60, '01:00'],
      [119, '01:59'],
      [600, '10:00'],
    ];

    it.each(scenarios)('input: %d, should produce: %s', (input, output) => {
      expect(getDurationFromSeconds(input)).toEqual(output);
    });
  });

  describe('getSecondsFromDuration', () => {
    const scenarios: [
      Parameters<typeof getSecondsFromDuration>[0],
      ReturnType<typeof getSecondsFromDuration>,
    ][] = [
      ['00:00', 0],
      ['00:01', 1],
      ['00:09', 9],
      ['00:10', 10],
      ['00:59', 59],
      ['01:00', 60],
      ['01:59', 119],
      ['10:00', 600],
    ];

    it.each(scenarios)('input: %d, should produce: %s', (input, output) => {
      expect(getSecondsFromDuration(input)).toEqual(output);
    });
  });

  describe('getWaveIndex', () => {
    const scenarios: [
      Parameters<typeof getWaveIndex>,
      ReturnType<typeof getWaveIndex>,
    ][] = [
      [[0, 45], 0],
      [[10, 45], 0],
      [[45, 45], 1],
      [[50, 25], 2],
      [[49, 25], 1],
    ];

    it.each(scenarios)(
      '[time, waveTime] => %j, should produce: %s',
      (input, output) => {
        expect(getWaveIndex(...input)).toEqual(output);
      },
    );
  });

  describe('getWavePassedTime', () => {
    const scenarios: [
      Parameters<typeof getWavePassedTime>,
      ReturnType<typeof getWavePassedTime>,
    ][] = [
      [[0, 45], 0],
      [[10, 45], 10],
      [[45, 45], 0],
      [[50, 25], 0],
      [[49, 25], 24],
    ];

    it.each(scenarios)(
      '[time, waveTime] => %j, should produce: %s',
      (input, output) => {
        expect(getWavePassedTime(...input)).toEqual(output);
      },
    );
  });

  describe('getPhaseLeftTime', () => {
    const scenarios: [
      Parameters<typeof getPhaseLeftTime>,
      ReturnType<typeof getPhaseLeftTime>,
    ][] = [
      [[0, 45, 30], 30],
      [[10, 45, 30], 20],
      [[45, 45, 30], 30],
      [[50, 25, 30], 30],
      [[49, 25, 30], 6],
      [[26, 25, 1], 0],
      [[24, 25, 1], 1],
    ];

    it.each(scenarios)(
      '[time, waveTime, heatTime] => %j, should produce: %s',
      (input, output) => {
        expect(getPhaseLeftTime(...input)).toEqual(output);
      },
    );
  });

  describe('getPhase', () => {
    const scenarios: [
      Parameters<typeof getPhase>,
      ReturnType<typeof getPhase>,
    ][] = [
      [[0, 45, 30], 'HEATING'],
      [[10, 45, 30], 'HEATING'],
      [[45, 45, 30], 'HEATING'],
      [[50, 25, 30], 'HEATING'],
      [[49, 25, 30], 'HEATING'],
      [[50, 20, 9], 'BLAZE'],
      [[10, 30, 8], 'BLAZE'],
    ];

    it.each(scenarios)(
      '[time, waveTime, heatTime] => %j, should produce: %s',
      (input, output) => {
        expect(getPhase(...input)).toEqual(output);
      },
    );
  });

  describe('roundNum', () => {
    const scenarios: [
      Parameters<typeof roundNum>[0],
      ReturnType<typeof roundNum>,
    ][] = [
      [0, 0],
      [1.123123, 1.12],
      [9.9899, 9.99],
    ];

    it.each(scenarios)('input: %d, should produce: %s', (input, output) => {
      expect(roundNum(input)).toEqual(output);
    });
  });
});
