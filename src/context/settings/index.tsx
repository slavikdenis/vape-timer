import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as storage from '../../utils/storage';

type SettingsContextState = {
  heatingTime: number;
  blazeTime: number;
  autoStopTime: number;
  autoStopTimer: boolean;
  screenWakeLock: boolean;
  vibrations: boolean;
};

export type TimeSettingContextKeys = keyof Pick<
  SettingsContextState,
  'blazeTime' | 'heatingTime' | 'autoStopTime'
>;

type SettingsContextFunctions = {
  setSetting: (
    key: keyof SettingsContextState,
    value: SettingsContextState[typeof key],
  ) => void;
  setDefaultTimers: () => void;
};

type SettingsContextConstants = {
  waveTime: number;
  areTimerSettingsDefault: boolean;
};

export const DEFAULT_HEATING_TIME = 30;
export const DEFAULT_BLAZE_TIME = 15;
export const DEFAULT_AUTO_STOP_TIME = 300;

const initialSettingsContext: SettingsContextState &
  SettingsContextFunctions &
  SettingsContextConstants = {
  areTimerSettingsDefault: true,
  heatingTime: DEFAULT_HEATING_TIME,
  blazeTime: DEFAULT_BLAZE_TIME,
  waveTime: DEFAULT_HEATING_TIME + DEFAULT_BLAZE_TIME,
  autoStopTime: DEFAULT_AUTO_STOP_TIME,
  autoStopTimer: false,
  screenWakeLock: true,
  vibrations: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSetting: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDefaultTimers: () => {},
};

const SettingsContext = createContext<
  SettingsContextState & SettingsContextFunctions & SettingsContextConstants
>(initialSettingsContext);

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // State
  const [state, setState] = useState<SettingsContextState>(
    initialSettingsContext,
  );

  // Check if settings are default
  const areTimerSettingsDefault = useMemo(() => {
    return (
      state.blazeTime === initialSettingsContext.blazeTime &&
      state.heatingTime === initialSettingsContext.heatingTime &&
      state.autoStopTime === initialSettingsContext.autoStopTime
    );
  }, [state.blazeTime, state.heatingTime, state.autoStopTime]);

  // Handlers
  const setSetting = useCallback(
    (
      key: keyof SettingsContextState,
      value: SettingsContextState[typeof key],
    ) => {
      // set settings
      setState((s) => ({
        ...s,
        [key]: value,
      }));
      // persist setting
      storage.set<typeof value>(key, value);
    },
    [],
  );

  const setDefaultTimers = useCallback(() => {
    const newState: Partial<SettingsContextState> = {
      blazeTime: initialSettingsContext.blazeTime,
      heatingTime: initialSettingsContext.heatingTime,
      autoStopTime: initialSettingsContext.autoStopTime,
    };
    // set settings
    setState((s) => ({
      ...s,
      ...newState,
    }));
    // persist setting
    Object.entries(newState).forEach(([key, value]) => {
      storage.set<typeof value>(key as storage.StorageKeys, value);
    });
  }, []);

  // Initialize state
  useEffect(() => {
    setState({
      blazeTime:
        storage.get<number>('blazeTime') ?? initialSettingsContext.blazeTime,
      heatingTime:
        storage.get<number>('heatingTime') ??
        initialSettingsContext.heatingTime,
      autoStopTime:
        storage.get<number>('autoStopTime') ??
        initialSettingsContext.autoStopTime,
      autoStopTimer:
        storage.get<boolean>('autoStopTimer') ??
        initialSettingsContext.autoStopTimer,
      screenWakeLock:
        storage.get<boolean>('screenWakeLock') ??
        initialSettingsContext.screenWakeLock,
      vibrations:
        storage.get<boolean>('vibrations') ?? initialSettingsContext.vibrations,
    });
  }, []);

  const waveTime = state.heatingTime + state.blazeTime;

  useEffect(() => {
    if (waveTime > state.autoStopTime) {
      setSetting('autoStopTime', waveTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waveTime]);

  return (
    <SettingsContext.Provider
      value={{
        ...state,
        waveTime,
        areTimerSettingsDefault,
        setSetting,
        setDefaultTimers,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
