import { TimerPhase } from '../typings';

export const addZeroIfShortNumber = (num: number) => {
  return num < 10 ? `0${num}` : num.toString();
};

export const getDurationFromSeconds = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - 60 * minutes);

  return `${addZeroIfShortNumber(minutes)}:${addZeroIfShortNumber(seconds)}`;
};

export const getSecondsFromDuration = (duration: string) => {
  const dur = duration.split(':').map(Number);
  return dur[0] * 60 + dur[1];
};

export const getWaveIndex = (time: number, waveTime: number) =>
  Math.floor(time / waveTime);

export const getWavePassedTime = (time: number, waveTime: number): number =>
  time - waveTime * getWaveIndex(time, waveTime);

export const getPhaseLeftTime = (
  time: number,
  waveTime: number,
  heatTime: number,
): number => {
  const waveTimePassed = getWavePassedTime(time, waveTime);

  return waveTimePassed <= heatTime
    ? heatTime - waveTimePassed
    : waveTime - waveTimePassed;
};

export const getPhase = (
  time: number,
  waveTime: number,
  heatTime: number,
): TimerPhase => {
  const waveTimePassed = getWavePassedTime(time, waveTime);
  return waveTimePassed <= heatTime ? 'HEATING' : 'BLAZE';
};

export const roundNum = (num: number) => {
  const x = Math.pow(10, 2);
  return Math.round(num * x) / x;
};
