import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TimerPhase } from '../../typings';
import {
  getDurationFromSeconds,
  getPhase,
  getPhaseLeftTime,
  roundNum,
} from '../../utils/timer';
import { useSettingsContext } from '../settings';

// Constants
const TIMER_REFRESH_RATE_MIL_SEC = 10;

type TimerContextState = {
  state: 'INITIAL' | 'RUNNING' | 'PAUSED';
};

type TimerContextFunctions = {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
};

type TimerContextConstants = {
  phase: TimerPhase;
  total: string;
  totalInSeconds: number;
  nextPhaseTime: string;
  progress: Record<TimerPhase, number>;
};

const initialTimerContext: TimerContextState &
  TimerContextFunctions &
  TimerContextConstants = {
  state: 'INITIAL',
  phase: 'HEATING',
  total: '?',
  totalInSeconds: 0,
  nextPhaseTime: '?',
  progress: { BLAZE: 0, HEATING: 0 },
  startTimer: () => {
    // noop
  },
  pauseTimer: () => {
    // noop
  },
  resetTimer: () => {
    // noop
  },
};

const TimerContext = createContext<
  TimerContextState & TimerContextFunctions & TimerContextConstants
>(initialTimerContext);

export const useTimerContext = () => useContext(TimerContext);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  // Settings
  const { blazeTime, heatingTime, waveTime } = useSettingsContext();
  const WAVE_TIME_MIL_SEC = waveTime * 1000;
  const HEATING_TIME_MIL_SEC = heatingTime * 1000;
  const BLAZE_TIME_MIL_SEC = blazeTime * 1000;

  // State
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  // Interval timer
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Tab inactivity timer
  const tabWentInactiveAt = useRef<number | null>(null);

  // Handlers
  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const startTimerInterval = useCallback(() => {
    timer.current = setInterval(
      () => setTime((s) => s + TIMER_REFRESH_RATE_MIL_SEC),
      TIMER_REFRESH_RATE_MIL_SEC,
    );
  }, []);

  const startTimer = useCallback(() => {
    startTimerInterval();
    setIsRunning(true);
  }, [startTimerInterval]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setTime(0);
    setIsRunning(false);
  }, [clearTimer]);

  const pauseTimer = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const visibilityChangeHandler = useCallback(() => {
    if (isRunning) {
      if (document.hidden) {
        // tab is now inactive
        // clear timers
        clearTimer();
        // set temp value
        tabWentInactiveAt.current = Date.now();
      } else {
        // tab is active again
        // add time while tab was inactive
        const elapsedTime = Date.now() - (tabWentInactiveAt.current ?? 0);
        setTime((s) => s + elapsedTime);
        // restart timers
        startTimerInterval();
        // reset temp value
        tabWentInactiveAt.current = null;
      }
    }
  }, [isRunning, clearTimer, startTimerInterval]);

  // Watch tab visibity
  useEffect(() => {
    document.addEventListener('visibilitychange', visibilityChangeHandler);

    return () => {
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
    };
  }, [visibilityChangeHandler]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // State
  let state: TimerContextState['state'] = 'INITIAL';
  if (time > 0 && isRunning) {
    state = 'RUNNING';
  } else if (time > 0 && !isRunning) {
    state = 'PAUSED';
  }

  // Calculated timers
  const phaseTime = getPhaseLeftTime(
    time,
    WAVE_TIME_MIL_SEC,
    HEATING_TIME_MIL_SEC,
  );
  const phase = getPhase(time, WAVE_TIME_MIL_SEC, HEATING_TIME_MIL_SEC);
  const totalInSeconds = time / 1000;
  const total = getDurationFromSeconds(totalInSeconds);
  const nextPhaseTime = getDurationFromSeconds(phaseTime / 1000);

  const values = useMemo(() => {
    const progress: Record<TimerPhase, number> = {
      HEATING: roundNum((phaseTime / HEATING_TIME_MIL_SEC) * 100),
      BLAZE: roundNum((phaseTime / BLAZE_TIME_MIL_SEC) * 100),
    };

    return {
      state,
      startTimer,
      resetTimer,
      pauseTimer,
      phase,
      total,
      totalInSeconds,
      nextPhaseTime,
      progress,
    };
  }, [
    state,
    startTimer,
    resetTimer,
    pauseTimer,
    phase,
    total,
    totalInSeconds,
    nextPhaseTime,
    phaseTime,
    BLAZE_TIME_MIL_SEC,
    HEATING_TIME_MIL_SEC,
  ]);

  return (
    <TimerContext.Provider value={values}>{children}</TimerContext.Provider>
  );
};
