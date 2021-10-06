import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  nextPhaseTime: string;
  progress: Record<TimerPhase, number>;
};

const initialTimerContext: TimerContextState &
  TimerContextFunctions &
  TimerContextConstants = {
  state: 'INITIAL',
  phase: 'HEATING',
  total: '?',
  nextPhaseTime: '?',
  progress: { BLAZE: 0, HEATING: 0 },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  startTimer: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  pauseTimer: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  resetTimer: () => {},
};

const TimerContext = createContext<
  TimerContextState & TimerContextFunctions & TimerContextConstants
>(initialTimerContext);

export const useTimerContext = () => useContext(TimerContext);

export const TimerProvider: React.FC = ({ children }) => {
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
  }, []);

  const resetTimer = useCallback(() => {
    clearTimer();
    setTime(0);
    setIsRunning(false);
  }, []);

  const pauseTimer = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, []);

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
  }, [isRunning]);

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
  const total = getDurationFromSeconds(time / 1000);
  const nextPhaseTime = getDurationFromSeconds(phaseTime / 1000);
  const progress: Record<TimerPhase, number> = {
    HEATING: roundNum((phaseTime / HEATING_TIME_MIL_SEC) * 100),
    BLAZE: roundNum((phaseTime / BLAZE_TIME_MIL_SEC) * 100),
  };

  return (
    <TimerContext.Provider
      value={{
        state,
        startTimer,
        resetTimer,
        pauseTimer,
        phase,
        total,
        nextPhaseTime,
        progress,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
