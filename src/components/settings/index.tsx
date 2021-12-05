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
import { memo, useCallback } from 'react';
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
  const isTimerRunning = state === 'RUNNING';

  // Handler
  const handleTimersReset = useCallback(() => {
    if (isTimerRunning) {
      showAlert();
    } else {
      setDefaultTimers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning]);

  const handleAlertConfirm = useCallback(() => {
    resetTimer();
    hideAlert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            onClose={hideAlert}
          />

          <DrawerCloseButton
            aria-label="Close settings"
            css={css`
              position: absolute;
              right: 24px;
              top: 18px;
            `}
          />

          <DrawerHeader borderBottomWidth="1px">Settings</DrawerHeader>

          <DrawerBody overflowX="hidden">
            <Content isTimerRunning={isTimerRunning} showAlert={showAlert} />
          </DrawerBody>

          {!areTimerSettingsDefault && (
            <DrawerFooter>
              <Button
                minimal
                fullWidth
                onClick={handleTimersReset}
                aria-label="Reset timers"
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
