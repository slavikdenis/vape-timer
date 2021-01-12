import { css } from '@emotion/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Box, ScaleFade, Flex, useDisclosure, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import FireIcon from '../icons/FireIcon';
import WindIcon from '../icons/WindIcon';
import { AnimatedPulse } from '../../styling';
import { AbsoluteCenter } from '../styled';
import CircleButton from '../CircleButton';
import PlayIcon from '../icons/PlayIcon';
import PauseIcon from '../icons/PauseIcon';
import ResetIcon from '../icons/ResetIcon';
import SettingsIcon from '../icons/SettingsIcon';
// import QuestionIcon from '../icons/QuestionIcon';
import CircleProgress from '../CircleProgress';

import {
  getDurationFromSeconds,
  getPhase,
  getPhaseLeftTime,
  roundNum,
} from '../../utils/timer';
import { useScreenWakeLock, useVibrate } from '../../utils/hooks';
import { useTheme } from '../../styling/theme';
import { useSettingsContext } from '../../context/settings';

const SettingsDrawer = dynamic(() => import('../settings'));

// svg
const TIMER_SIZE = 170;
const TIMER_STROKE_WIDTH = 8;

// responsive
const HEIGHT_BREAKING_POINT = 480;

// timers
const TIMER_REFRESH_RATE_MIL_SEC = 10;

const Timer = () => {
  // Vibration API
  const { vibrate } = useVibrate();

  // Screen Wake Lock API
  const { lock, release } = useScreenWakeLock();

  // Theme
  const { colors } = useTheme();

  // State
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  // Interval timer
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Settings
  const {
    screenWakeLock,
    vibrations,
    blazeTime,
    heatingTime,
    waveTime,
  } = useSettingsContext();

  // Constants
  const WAVE_TIME_MIL_SEC = waveTime * 1000;
  const HEATING_TIME_MIL_SEC = heatingTime * 1000;
  const BLAZE_TIME_MIL_SEC = blazeTime * 1000;

  const didTimerStarted = time !== 0;
  const phaseTime = getPhaseLeftTime(
    time,
    WAVE_TIME_MIL_SEC,
    HEATING_TIME_MIL_SEC,
  );
  const phase = getPhase(time, WAVE_TIME_MIL_SEC, HEATING_TIME_MIL_SEC);
  const total = getDurationFromSeconds(time / 1000);
  const nextPhaseTime = getDurationFromSeconds(phaseTime / 1000);

  // Settings
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);

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

  const handleOpenSettings = useCallback(() => {
    onOpen();
    handleReset();
  }, [handleReset, onOpen]);

  // Effects
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  useEffect(() => {
    // Vibrate device, when phase changes to blaze
    if (phase === 'BLAZE' && vibrations) {
      vibrate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, vibrations]);

  useEffect(() => {
    // Lock screen, when timer is running
    if (isRunning && screenWakeLock) {
      lock();
    } else {
      release();
    }

    return () => {
      release();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, screenWakeLock]);

  return (
    <>
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        css={css`
          height: 100vh;
          max-height: -webkit-fill-available;
        `}
      >
        {!didTimerStarted ? (
          <ScaleFade in>
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
          </ScaleFade>
        ) : (
          <Box pos="relative">
            <ScaleFade in>
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
            </ScaleFade>

            <Box
              width="100%"
              textAlign="center"
              position="absolute"
              top="-60px"
              fontSize="15px"
            >
              <ScaleFade in>
                <Text fontSize="1em" opacity={0.6}>
                  total
                </Text>
                <Text fontSize="1.2em" fontFamily="monospace" fontWeight={600}>
                  {total}
                </Text>
              </ScaleFade>
            </Box>

            <Box
              width="100%"
              textAlign="center"
              position="absolute"
              bottom="-60px"
              fontSize="15px"
            >
              <ScaleFade in>
                <Text fontSize="1.2em" fontFamily="monospace" fontWeight={600}>
                  {nextPhaseTime}
                </Text>
                <Text fontSize="1em" opacity={0.6} textTransform="lowercase">
                  {phase} phase
                </Text>
              </ScaleFade>
            </Box>

            <div
              css={css`
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                margin-top: 10px;

                @media (max-height: ${HEIGHT_BREAKING_POINT}px) {
                  margin-top: 0;
                  top: 50%;
                  transform: translate(-50%, -50%);
                }
              `}
            >
              <ScaleFade in>
                <Flex>
                  {isRunning ? (
                    <CircleButton
                      aria-label="Pause"
                      onClick={handlePause}
                      size={60}
                      borderWidth={3}
                      color={colors.green['600']}
                    >
                      <PauseIcon width="28px" height="28px" />
                    </CircleButton>
                  ) : (
                    <CircleButton
                      aria-label="Resume"
                      onClick={handleStart}
                      size={60}
                      borderWidth={3}
                      color={colors.cyan['600']}
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
                      margin-left: 140px;

                      @media (max-height: ${HEIGHT_BREAKING_POINT}px) {
                        margin-left: 220px;
                      }
                    `}
                  >
                    <ResetIcon width="26px" height="26px" />
                  </CircleButton>
                </Flex>
              </ScaleFade>
            </div>
          </Box>
        )}

        {/* <Box pos="absolute" left="20px" bottom="20px">
        <CircleButton
          aria-label="About"
          onClick={() => push('/about')}
          size={54}
          borderWidth={3}
          color={colors.gray['500']}
        >
          <QuestionIcon width="34px" height="34px" />
        </CircleButton>
      </Box> */}

        <Box pos="absolute" right="20px" bottom="20px">
          <CircleButton
            ref={btnRef}
            aria-label="Settings"
            onClick={handleOpenSettings}
            size={54}
            borderWidth={3}
            color={colors.gray['500']}
          >
            <SettingsIcon width="24px" height="24px" />
          </CircleButton>
        </Box>
      </Flex>

      <SettingsDrawer
        isOpen={isOpen}
        onClose={() => {
          handlePause();
          onClose();
        }}
        finalFocusRef={btnRef}
      />
    </>
  );
};

export default memo(Timer);
