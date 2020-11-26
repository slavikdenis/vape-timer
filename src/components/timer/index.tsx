import { css } from '@emotion/react';
import {
  // Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
// import { useRouter } from 'next/router';
import { Box, Flex, FormControl, FormLabel, Switch } from '@chakra-ui/react';

import FireIcon from '../icons/FireIcon';
import WindIcon from '../icons/WindIcon';
import { AnimatedPulse } from '../../styling';
import { AbsoluteCenter } from '../styled';
import CircleButton from '../CircleButton';
import PlayIcon from '../icons/PlayIcon';
import PauseIcon from '../icons/PauseIcon';
import ResetIcon from '../icons/ResetIcon';
import { TimerPhase } from '../../typings';
import {
  getDurationFromSeconds,
  getWaveIndex,
  getWavePassedTime,
} from '../../utils/timer';
import { useScreenWakeLock, useVibrate } from '../../utils/hooks';
// import SettingsIcon from '../icons/SettingsIcon';
// import QuestionIcon from '../icons/QuestionIcon';
import CircleProgress from '../CircleProgress';
import { useTheme } from '../../styling/theme';

// svg
const TIMER_SIZE = 162;
const TIMER_STROKE_WIDTH = 8;

// responsive
const HEIGHT_BREAKING_POINT = 480;

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

const roundNum = (num: number) => {
  const x = Math.pow(10, 2);
  return Math.round(num * x) / x;
};

const Timer = () => {
  // Vibration API
  const { vibrate } = useVibrate();

  // Screen Wake Lock API
  const {
    isLocked,
    isSupported: isScreenWakeSupported,
    lock,
    release,
  } = useScreenWakeLock();

  // Theme
  const { colors } = useTheme();

  // Router
  // const { push } = useRouter();

  // State
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  // Screen lock
  const handleScreenLock = useCallback(async (checked: boolean) => {
    if (checked) {
      await lock();
    } else {
      release();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Interval timer
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Constants
  const didTimerStarted = time !== 0;
  const phaseTime = getPhaseLeftTime(time);
  const phase = getPhase(time);
  const total = getDurationFromSeconds(time / 1000);
  const wave = getWaveIndex(time, WAVE_TIME_MIL_SEC) + 1;
  const nextPhaseTime = getDurationFromSeconds(phaseTime / 1000);

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
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      {!didTimerStarted ? (
        <CircleButton
          onClick={handleStart}
          size={TIMER_SIZE - TIMER_STROKE_WIDTH}
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
        <Box pos="relative">
          {phase === 'HEATING' ? (
            <CircleProgress
              progress={roundNum((phaseTime / HEATING_TIME_MIL_SEC) * 100)}
              size={TIMER_SIZE}
              strokeWidth={TIMER_STROKE_WIDTH}
              strokeColors={{
                active: colors.orange['500'],
                bg: colors.gray['500'],
              }}
            />
          ) : (
            <CircleProgress
              progress={roundNum((phaseTime / BLAZE_TIME_MIL_SEC) * 100)}
              size={TIMER_SIZE}
              strokeWidth={TIMER_STROKE_WIDTH}
              strokeColors={{
                active: colors.green['500'],
                bg: colors.gray['500'],
              }}
            />
          )}

          <AbsoluteCenter>
            <AnimatedPulse isPaused={!isRunning}>
              {phase === 'HEATING' ? (
                <FireIcon height="60px" width="60px" />
              ) : (
                <WindIcon height="60px" width="60px" />
              )}
            </AnimatedPulse>
          </AbsoluteCenter>

          <div
            css={css`
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              margin-top: 20px;

              @media (max-height: ${HEIGHT_BREAKING_POINT}px) {
                margin: 0;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            `}
          >
            <Flex>
              {isRunning ? (
                <CircleButton
                  aria-label="Pause"
                  onClick={handlePause}
                  size={60}
                  borderWidth={3}
                  color={colors.yellow['600']}
                >
                  <PauseIcon width="28px" height="28px" />
                </CircleButton>
              ) : (
                <CircleButton
                  aria-label="Resume"
                  onClick={handleStart}
                  size={60}
                  borderWidth={3}
                  color={colors.green['400']}
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
                color={colors.red['400']}
                css={css`
                  margin-left: 42px;

                  @media (max-height: ${HEIGHT_BREAKING_POINT}px) {
                    margin-left: 220px;
                  }
                `}
              >
                <ResetIcon width="26px" height="26px" />
              </CircleButton>
            </Flex>
          </div>
        </Box>
      )}

      {isScreenWakeSupported && (
        <Box pos="absolute" bottom={0} mb="32px">
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FormLabel htmlFor="screen-wake-lock" mb="0">
              Screen Wake Lock
            </FormLabel>
            <Switch
              id="screen-wake-lock"
              onChange={(e) => handleScreenLock(e.target.checked)}
              isChecked={isLocked}
              colorScheme="teal"
              size="md"
            />
          </FormControl>
        </Box>
      )}

      {/* <Fragment>
        <Box pos="absolute" left="20px" bottom="20px">
          <CircleButton
            aria-label="About"
            onClick={() => push('/about')}
            size={60}
            borderWidth={3}
            color={colors.gray['500']}
          >
            <QuestionIcon width="34px" height="34px" />
          </CircleButton>
        </Box>

        <Box pos="absolute" right="20px" bottom="20px">
          <CircleButton
            aria-label="Settings"
            onClick={() => push('/settings')}
            size={60}
            borderWidth={3}
            color={colors.gray['500']}
          >
            <SettingsIcon width="26px" height="26px" />
          </CircleButton>
        </Box>
      </Fragment> */}
    </Flex>
  );
};

export default memo(Timer);
