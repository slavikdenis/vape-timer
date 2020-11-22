export const addZeroIfShortNumber = (num: number) => {
  return num < 10 ? `0${num}` : num.toString();
};

export const getDurationFromSeconds = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - 60 * minutes);

  return `${addZeroIfShortNumber(minutes)}:${addZeroIfShortNumber(seconds)}`;
};

export const getWaveIndex = (time: number, waveTime: number) =>
  Math.floor(time / waveTime);

export const getWavePassedTime = (time: number, waveTime: number): number =>
  time - waveTime * getWaveIndex(time, waveTime);
