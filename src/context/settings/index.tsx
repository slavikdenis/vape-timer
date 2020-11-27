import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as storage from '../../utils/storage';

type SettingsContextState = {
  heatingTime: number;
  blazeTime: number;
  screenWakeLock: boolean;
  vibrations: boolean;
};

type SettingsContextFunctions = {
  setSetting: (
    key: keyof SettingsContextState,
    value: SettingsContextState[typeof key],
  ) => void;
  setDefaultValues: () => void;
};

export const DEFAULT_HEATING_TIME = 30;
export const DEFAULT_BLAZE_TIME = 15;

const initialSettingsContext: SettingsContextState &
  SettingsContextFunctions & { waveTime: number } = {
  heatingTime: DEFAULT_HEATING_TIME,
  blazeTime: DEFAULT_BLAZE_TIME,
  waveTime: DEFAULT_HEATING_TIME + DEFAULT_BLAZE_TIME,
  screenWakeLock: true,
  vibrations: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSetting: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDefaultValues: () => {},
};

const SettingsContext = createContext<
  SettingsContextState & SettingsContextFunctions & { waveTime: number }
>(initialSettingsContext);

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider: React.FC = ({ children }) => {
  // State
  const [state, setState] = useState<SettingsContextState>(
    initialSettingsContext,
  );

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

  const setDefaultValues = useCallback(() => {
    setSetting('blazeTime', initialSettingsContext.blazeTime);
    setSetting('heatingTime', initialSettingsContext.heatingTime);
    setSetting('screenWakeLock', initialSettingsContext.screenWakeLock);
    setSetting('vibrations', initialSettingsContext.vibrations);
  }, [setSetting]);

  // Initialize state
  useEffect(() => {
    setState({
      blazeTime:
        storage.get<number>('blazeTime') ?? initialSettingsContext.blazeTime,
      heatingTime:
        storage.get<number>('heatingTime') ??
        initialSettingsContext.heatingTime,
      screenWakeLock:
        storage.get<boolean>('screenWakeLock') ??
        initialSettingsContext.screenWakeLock,
      vibrations:
        storage.get<boolean>('vibrations') ?? initialSettingsContext.vibrations,
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        ...state,
        waveTime: state.heatingTime + state.blazeTime,
        setSetting,
        setDefaultValues,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
