import { Box, useDisclosure } from '@chakra-ui/react';
import { memo, useCallback } from 'react';

import {
  TimeSettingContextKeys,
  useSettingsContext,
} from '../../context/settings';
import { useScreenWakeLock, useVibrate } from '../../utils/hooks';

import SettingsAlert from './SettingsAlert';
import SettingsSectionTitle from './SettingsSectionTitle';
import SettingTimerField from './SettingTimerField';
import SettingsSwitchField from './SettingsSwitchField';
import {
  BlazeTimerPopover,
  HeatingTimerPopover,
  ScreenWakeLockPopover,
  VibrationsPopover,
} from './popovers';

type SettingsContentProps = {
  isTimerRunning: boolean;
  resetTimer: () => void;
};

const SettingsContent = ({
  isTimerRunning,
  resetTimer,
}: SettingsContentProps) => {
  // Alert dialog
  const {
    isOpen: isAlertShown,
    onOpen: showAlert,
    onClose: hideAlert,
  } = useDisclosure();

  // Vibrations API
  const { isSupported: isVibSupported } = useVibrate();

  // Screen Wake Lock API
  const { isSupported: isSWLSupported } = useScreenWakeLock();

  // Settings context
  const { setSetting, blazeTime, heatingTime, screenWakeLock, vibrations } =
    useSettingsContext();

  const values = { blazeTime, heatingTime };

  // Handlers
  const handleTimerChange = useCallback(
    (type: TimeSettingContextKeys, value: number) => {
      const didValueChange = values[type] !== value;

      if (didValueChange) {
        if (isTimerRunning) {
          showAlert();
        } else {
          setSetting(type, Number.isNaN(value) ? 5 : value);
        }
      }
    },
    [isTimerRunning, values],
  );

  const handleAlertConfirm = useCallback(() => {
    resetTimer();
    hideAlert();
  }, []);

  return (
    <>
      <SettingsAlert
        isOpen={isAlertShown}
        onConfirm={handleAlertConfirm}
        onClose={hideAlert}
      />

      <Box w="100%" mt={2} mb={4}>
        <SettingsSectionTitle title="Timers" />

        <SettingTimerField
          fieldId="heatingTime"
          title="Heating timer"
          value={heatingTime}
          onChange={(v) => handleTimerChange('heatingTime', v)}
          popover={<HeatingTimerPopover />}
        />

        <SettingTimerField
          fieldId="blazeTime"
          title="Blaze timer"
          value={blazeTime}
          onChange={(v) => handleTimerChange('blazeTime', v)}
          popover={<BlazeTimerPopover />}
        />
      </Box>

      <Box w="100%" mb={4}>
        <SettingsSectionTitle title="Features" />

        <SettingsSwitchField
          fieldId="screenWakeLock"
          title="Screen Wake Lock"
          isChecked={screenWakeLock}
          onChange={(v) => setSetting('screenWakeLock', v)}
          popover={<ScreenWakeLockPopover />}
          disabled={isSWLSupported}
        />

        <SettingsSwitchField
          fieldId="vibrations"
          title="Vibrations"
          isChecked={vibrations}
          onChange={(v) => setSetting('vibrations', v)}
          popover={<VibrationsPopover />}
          disabled={isVibSupported}
        />
      </Box>
    </>
  );
};

export default memo(SettingsContent);
