import { forwardRef, memo } from 'react';

import CircleButton from '../CircleButton';
import InfoIcon from '../icons/InfoIcon';

const SettingsInfoIcon = forwardRef<HTMLButtonElement>((props, ref) => (
  <CircleButton size={30} borderWidth={2} ref={ref} {...props}>
    <InfoIcon width={24} height={24} />
  </CircleButton>
));

SettingsInfoIcon.displayName = 'SettingsInfoIcon';

export default memo(SettingsInfoIcon);
