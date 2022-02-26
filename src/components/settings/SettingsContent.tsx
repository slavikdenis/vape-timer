import { Box, Checkbox } from '@chakra-ui/react';
import { memo, useCallback } from 'react';

import {
  TimeSettingContextKeys,
  useSettingsContext,
} from '../../context/settings';
import { useScreenWakeLock, useVibrate } from '../../utils/hooks';

import SettingsSectionTitle from './SettingsSectionTitle';
import SettingTimerField from './SettingTimerField';
import SettingsSwitchField from './SettingsSwitchField';
import {
  AutoStopTimerPopover,
  BlazeTimerPopover,
  HeatingTimerPopover,
  ScreenWakeLockPopover,
  VibrationsPopover,
} from './popovers';

const WAVE_TIMER_MIN = 5;
const WAVE_TIMER_MAX = 1800;
const AUTO_STOP_MIN = 10;
const AUTO_STOP_MAX = 3600;

type SettingsContentProps = {
  isTimerRunning: boolean;
  showAlert: () => void;
};

const SettingsContent = ({
  isTimerRunning,
  showAlert,
}: SettingsContentProps) => {
  // Vibrations API
  const { isSupported: isVibSupported } = useVibrate();

  // Screen Wake Lock API
  const { isSupported: isSWLSupported } = useScreenWakeLock();

  // Settings context
  const {
    setSetting,
    blazeTime,
    heatingTime,
    waveTime,
    autoStopTime,
    autoStopTimer,
    screenWakeLock,
    vibrations,
  } = useSettingsContext();

  const values = { blazeTime, heatingTime, autoStopTime };

  // Handlers
  const handleTimerChange = useCallback(
    (type: TimeSettingContextKeys, value: number) => {
      const didValueChange = values[type] !== value;

      if (didValueChange) {
        if (isTimerRunning) {
          showAlert();
        } else {
          setSetting(type, value);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTimerRunning, values],
  );

  return (
    <>
      <Box w="100%" mt={2} mb={4}>
        <SettingsSectionTitle title="Timers" />

        <SettingTimerField
          fieldId="heatingTime"
          title="Heating timer"
          value={heatingTime}
          onChange={(v) => handleTimerChange('heatingTime', v)}
          minValue={WAVE_TIMER_MIN}
          maxValue={WAVE_TIMER_MAX}
          PopoverComponent={<HeatingTimerPopover />}
        />

        <SettingTimerField
          fieldId="blazeTime"
          title="Blaze timer"
          value={blazeTime}
          onChange={(v) => handleTimerChange('blazeTime', v)}
          minValue={WAVE_TIMER_MIN}
          maxValue={WAVE_TIMER_MAX}
          PopoverComponent={<BlazeTimerPopover />}
        />

        <SettingTimerField
          fieldId="autoStopTime"
          title="Auto Stop timer"
          value={autoStopTime}
          onChange={(v) => handleTimerChange('autoStopTime', v)}
          minValue={Math.max(AUTO_STOP_MIN, waveTime)}
          maxValue={AUTO_STOP_MAX}
          disabled={!autoStopTimer}
          PopoverComponent={<AutoStopTimerPopover />}
          CheckboxComponent={
            <Checkbox
              colorScheme="green"
              isChecked={autoStopTimer}
              onChange={(e) => setSetting('autoStopTimer', e.target.checked)}
              marginLeft="auto"
              marginRight="0.8rem"
              size="lg"
            />
          }
        />
      </Box>

      <Box w="100%" mb={4}>
        <SettingsSectionTitle title="Features" />

        <SettingsSwitchField
          fieldId="screenWakeLock"
          title="Screen Wake Lock"
          isChecked={screenWakeLock}
          onChange={(v) => setSetting('screenWakeLock', v)}
          PopoverComponent={<ScreenWakeLockPopover />}
          disabled={!isSWLSupported}
        />

        <SettingsSwitchField
          fieldId="vibrations"
          title="Vibrations"
          isChecked={vibrations}
          onChange={(v) => setSetting('vibrations', v)}
          PopoverComponent={<VibrationsPopover />}
          disabled={!isVibSupported}
        />
      </Box>
    </>
  );
};

export default memo(SettingsContent);
