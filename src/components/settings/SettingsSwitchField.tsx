import { memo } from 'react';
import {
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Switch,
} from '@chakra-ui/react';

import SettingsInfoIcon from './SettingsInfoIcon';

type SettingsSwitchFieldProps = {
  fieldId: string;
  title: string;
  isChecked: boolean;
  onChange: (value: boolean) => void;
  popover: React.ReactNode;
  disabled?: boolean;
};

const SettingsSwitchField = ({
  fieldId,
  title,
  popover,
  isChecked,
  onChange,
  disabled = false,
}: SettingsSwitchFieldProps) => {
  return (
    <FormControl id={fieldId}>
      <Flex mb={4} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Popover>
            <PopoverTrigger>
              <SettingsInfoIcon />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>{title}</PopoverHeader>
              <PopoverBody>
                <FormHelperText>{popover}</FormHelperText>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <FormLabel whiteSpace="nowrap" mb={0} pl={3}>
            {title}
          </FormLabel>
        </Flex>

        <Switch
          id={fieldId}
          onChange={(e) => onChange(e.target.checked)}
          isChecked={isChecked}
          colorScheme="green"
          size="lg"
          disabled={disabled}
        />
      </Flex>
    </FormControl>
  );
};

export default memo(SettingsSwitchField);
