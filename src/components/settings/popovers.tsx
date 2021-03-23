import { Tag } from '@chakra-ui/react';

import {
  DEFAULT_BLAZE_TIME,
  DEFAULT_HEATING_TIME,
} from '../../context/settings';

export const HeatingTimerPopover = () => (
  <>
    Time for your vaped material to heat up.
    <br />
    Suggested value is <Tag colorScheme="green">
      {DEFAULT_HEATING_TIME}
    </Tag>{' '}
    seconds.
  </>
);

export const BlazeTimerPopover = () => (
  <>
    Time for you to inhale. Inhale slowly and longer for better effect.
    <br />
    Suggested value is value is{' '}
    <Tag colorScheme="green">{DEFAULT_BLAZE_TIME}</Tag> seconds.
  </>
);

export const ScreenWakeLockPopover = () => (
  <>
    {'Prevents your device screen from dimming/locking when timer is running.'}
  </>
);

export const VibrationsPopover = () => (
  <>
    Vibrates your device every time when <Tag colorScheme="green">Blaze</Tag>{' '}
    phase starts.
  </>
);
