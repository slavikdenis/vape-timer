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

const TimerContext =
  createContext<
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

  // Handlers
  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    timer.current = setInterval(
      () => setTime((s) => s + TIMER_REFRESH_RATE_MIL_SEC),
      TIMER_REFRESH_RATE_MIL_SEC,
    );
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

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

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
