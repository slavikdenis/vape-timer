import { css } from '@emotion/react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Head from 'next/head';

import FireIcon from '../components/icons/FireIcon';
import WindIcon from '../components/icons/WindIcon';
import { AnimatedPulse } from '../styling';
import { AbsoluteCenter } from '../components/styled';
import CircleButton from '../components/CircleButton';
import PlayIcon from '../components/icons/PlayIcon';
import PauseIcon from '../components/icons/PauseIcon';
import ResetIcon from '../components/icons/ResetIcon';
import { TimerPhase } from '../typings';
import {
  getDurationFromSeconds,
  getWaveIndex,
  getWavePassedTime,
} from '../utils/timer';
import { useVibrate } from '../utils/hooks';

// svg
const INIT_OFFSET = 440;

// colors
const HEATING_COLOR = '#ec722c';
const BLAZE_COLOR = '#00b370';

// timers
const TIMER_REFRESH_RATE_MIL_SEC = 10;

const HEATING_TIME_MIL_SEC = 30 * 1000;
const BLAZE_TIME_MIL_SEC = 17 * 1000;
const WAVE_TIME_MIL_SEC = HEATING_TIME_MIL_SEC + BLAZE_TIME_MIL_SEC;

const getPhaseLeftTime = (time: number): number => {
  const waveTimePassed = getWavePassedTime(time, WAVE_TIME_MIL_SEC);

  return waveTimePassed <= HEATING_TIME_MIL_SEC
    ? HEATING_TIME_MIL_SEC - waveTimePassed
    : WAVE_TIME_MIL_SEC - waveTimePassed;
};

const getPhase = (time: number): TimerPhase => {
  const waveTimePassed = getWavePassedTime(time, WAVE_TIME_MIL_SEC);
  return waveTimePassed <= HEATING_TIME_MIL_SEC ? 'HEATING' : 'BLAZE';
};

export default function App() {
  const { vibrate } = useVibrate();

  // State
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  // Interval timer
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Constants
  const didTimerStarted = time !== 0;
  const phaseTime = getPhaseLeftTime(time);
  const phase = getPhase(time);
  const total = getDurationFromSeconds(time / 1000);
  const wave = getWaveIndex(time, WAVE_TIME_MIL_SEC) + 1;
  const nextPhaseTime = getDurationFromSeconds(phaseTime / 1000);

  const strokeOffset = useMemo(
    () =>
      phase === 'HEATING'
        ? (HEATING_TIME_MIL_SEC - phaseTime) *
          (INIT_OFFSET / HEATING_TIME_MIL_SEC)
        : (BLAZE_TIME_MIL_SEC - phaseTime) * (INIT_OFFSET / BLAZE_TIME_MIL_SEC),
    [phase, phaseTime],
  );

  // Handlers
  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const handleStart = useCallback(() => {
    timer.current = setInterval(
      () => setTime((s) => s + TIMER_REFRESH_RATE_MIL_SEC),
      TIMER_REFRESH_RATE_MIL_SEC,
    );
    setIsRunning(true);
  }, []);

  const handleReset = useCallback(() => {
    clearTimer();
    setTime(0);
    setIsRunning(false);
  }, [clearTimer]);

  const handlePause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  // Effects
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  useEffect(() => {
    // Vibrate device, when phase changes to blaze
    if (phase === 'BLAZE') {
      vibrate();
    }
  }, [phase, vibrate]);

  useEffect(() => {
    console.log({
      phase,
      total,
      wave,
      nextPhaseTime,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <React.Fragment>
      <Head>
        <title>VapeTimer</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        `}
      >
        {!didTimerStarted ? (
          <CircleButton
            onClick={handleStart}
            size={148}
            css={css`
              margin-top: -4px;
            `}
          >
            <AnimatedPulse>
              <PlayIcon
                width="60px"
                height="60px"
                css={css`
                  margin-left: 6px;
                `}
              />
            </AnimatedPulse>
          </CircleButton>
        ) : (
          <div
            css={css`
              position: relative;
            `}
          >
            <div
              css={css`
                position: relative;
                text-align: center;
              `}
            >
              <svg
                width="162px"
                height="162px"
                css={css`
                  transform: rotate(-90deg);
                `}
              >
                <g>
                  <title>Layer 1</title>
                  <circle
                    id="circle-bg"
                    r="69.85699"
                    cy="81"
                    cx="81"
                    strokeWidth="8"
                    stroke="#a0a0a0"
                    strokeOpacity={0.1}
                    strokeLinecap="round"
                    fill="none"
                  />

                  <circle
                    id="circle"
                    r="69.85699"
                    cy="81"
                    cx="81"
                    strokeWidth="8"
                    stroke={phase === 'HEATING' ? HEATING_COLOR : BLAZE_COLOR}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={INIT_OFFSET}
                    strokeDashoffset={strokeOffset}
                    css={css`
                      transition: dash 0.1s linear;
                    `}
                  />
                </g>
              </svg>

              <AbsoluteCenter>
                <AnimatedPulse isPaused={!isRunning}>
                  {phase === 'HEATING' ? (
                    <FireIcon fill="white" height="60px" width="60px" />
                  ) : (
                    <WindIcon fill="white" height="60px" width="60px" />
                  )}
                </AnimatedPulse>
              </AbsoluteCenter>
            </div>

            <div
              css={css`
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                margin-top: 20px;
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex-direction: row;
                `}
              >
                {isRunning ? (
                  <CircleButton
                    aria-label="Pause"
                    onClick={handlePause}
                    size={60}
                    borderWidth={3}
                  >
                    <PauseIcon width="28px" height="28px" />
                  </CircleButton>
                ) : (
                  <CircleButton
                    aria-label="Resume"
                    onClick={handleStart}
                    size={60}
                    borderWidth={3}
                  >
                    <PlayIcon
                      width="30px"
                      height="30px"
                      css={css`
                        margin-left: 3px;
                      `}
                    />
                  </CircleButton>
                )}

                <CircleButton
                  aria-label="Reset"
                  onClick={handleReset}
                  size={60}
                  borderWidth={3}
                  css={css`
                    margin-left: 42px;
                  `}
                >
                  <ResetIcon width="26px" height="26px" />
                </CircleButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
