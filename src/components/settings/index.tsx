import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  useDisclosure,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { memo } from 'react';
import { useSettingsContext } from '../../context/settings';
import { useTimerContext } from '../../context/timer';
import Button from '../Button';
import SettingsAlert from './SettingsAlert';
import Content from './SettingsContent';

type SettingsDrawerProps = Pick<
  DrawerProps,
  'isOpen' | 'onClose' | 'finalFocusRef'
>;

const SettingsDrawer = ({
  isOpen,
  onClose,
  finalFocusRef,
}: SettingsDrawerProps) => {
  // Alert dialog
  const {
    isOpen: isAlertShown,
    onOpen: showAlert,
    onClose: hideAlert,
  } = useDisclosure();

  // Settings context
  const { setDefaultTimers, areTimerSettingsDefault } = useSettingsContext();

  // Timer context
  const { state, resetTimer } = useTimerContext();
  const isTimerActive = state === 'PAUSED' || state === 'RUNNING';

  // Handler
  const handleTimersReset = () => {
    if (isTimerActive) {
      showAlert();
    } else {
      setDefaultTimers();
    }
  };

  const hideAlerts = () => {
    hideAlert();
  };

  const handleAlertConfirm = () => {
    resetTimer();
    hideAlerts();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      placement="right"
      size="sm"
    >
      <DrawerOverlay>
        <DrawerContent>
          <SettingsAlert
            isOpen={isAlertShown}
            onConfirm={handleAlertConfirm}
            onClose={hideAlerts}
            type={state === 'PAUSED' ? 'PAUSED' : 'RUNNING'}
          />

          <DrawerCloseButton
            aria-label="Close settings"
            css={css`
              position: absolute;
              right: 24px;
              top: 18px;
            `}
            data-testid="settings-close-button"
          />

          <DrawerHeader borderBottomWidth="1px" data-testid="settings-title">
            Settings
          </DrawerHeader>

          <DrawerBody overflowX="hidden">
            <Content isTimerActive={isTimerActive} showAlert={showAlert} />
          </DrawerBody>

          {!areTimerSettingsDefault && (
            <DrawerFooter>
              <Button
                minimal
                fullWidth
                onClick={handleTimersReset}
                aria-label="Reset timers"
                data-testid="reset-timers"
              >
                Reset timers
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default memo(SettingsDrawer);
