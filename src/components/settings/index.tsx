import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { memo } from 'react';
import { useSettingsContext } from '../../context/settings';
import { useTimerContext } from '../../context/timer';
import Button from '../Button';
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
  // Settings context
  const { setDefaultValues, areTimerSettingsDefault } = useSettingsContext();

  // Timer context
  const { state, resetTimer } = useTimerContext();
  const isTimerRunning = state === 'RUNNING';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={finalFocusRef}
      placement="right"
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
          />

          <DrawerHeader borderBottomWidth="1px">Settings</DrawerHeader>

          <DrawerBody>
            <Content isTimerRunning={isTimerRunning} resetTimer={resetTimer} />
          </DrawerBody>

          {!areTimerSettingsDefault && (
            <DrawerFooter>
              <Button
                minimal
                fullWidth
                onClick={setDefaultValues}
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
