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
import Button from '../Button';
import Content from './Content';

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
            css={css`
              position: absolute;
              right: 24px;
              top: 18px;
            `}
          />
          <DrawerHeader borderBottomWidth="1px">Settings</DrawerHeader>

          <DrawerBody>
            <Content />
          </DrawerBody>

          {!areTimerSettingsDefault ? (
            <DrawerFooter>
              <Button minimal fullWidth onClick={setDefaultValues}>
                Reset timers
              </Button>
            </DrawerFooter>
          ) : null}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default memo(SettingsDrawer);
