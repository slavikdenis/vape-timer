import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Link,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { memo, useRef } from 'react';
import { useSettingsContext } from '../../context/settings';
import { useTimerContext } from '../../context/timer';
import Button from '../Button';
import SettingsAlert from './SettingsAlert';
import Content from './SettingsContent';
import { getCurrentVersion } from '../../utils/utils';
import GithubIcon from '../icons/GithubIcon';

type SettingsDrawerProps = Pick<
  DrawerProps,
  'isOpen' | 'onClose' | 'finalFocusRef'
>;

const SettingsDrawer = ({
  isOpen,
  onClose,
  finalFocusRef,
}: SettingsDrawerProps) => {
  const packageVersion = useRef(getCurrentVersion()).current;

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
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={finalFocusRef}
        placement="right"
        size="sm"
        portalProps={{ appendToParentPortal: false }}
      >
        <DrawerOverlay>
          <DrawerContent>
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
              <DrawerFooter flexDirection="column">
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

            <Divider marginY={2} />

            <Box
              width="100%"
              paddingBottom={2}
              paddingX={6}
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="xs">Version: {packageVersion}</Text>

              <Link
                href="https://github.com/slavikdenis/vape-timer"
                target="_blank"
              >
                <GithubIcon width={30} height={30} fill="#FFFFFF" />
              </Link>
            </Box>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <SettingsAlert
        isOpen={isAlertShown}
        onConfirm={handleAlertConfirm}
        onClose={hideAlerts}
        type={state === 'PAUSED' ? 'PAUSED' : 'RUNNING'}
      />
    </>
  );
};

export default memo(SettingsDrawer);
