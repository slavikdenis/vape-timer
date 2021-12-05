import { memo } from 'react';
import {
  Flex,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  FormHelperText,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/react';

import SettingsInfoIcon from './SettingsInfoIcon';

type SettingTimerFieldProps = {
  fieldId: string;
  title: string;
  value: number;
  onChange: (value: number) => void;
  popover: React.ReactNode;
};

const SettingTimerField = ({
  fieldId,
  title,
  popover,
  value,
  onChange,
}: SettingTimerFieldProps) => {
  const format = (val: number) => `${val}s`;
  const parse = (val: string) => Number(val.replace('s', ''));

  return (
    <FormControl id={fieldId} mb={4}>
      <Flex alignItems="center" justifyContent="space-between">
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

        <NumberInput
          id={fieldId}
          value={format(value)}
          min={5}
          max={90}
          onChange={(val) => onChange(parse(val))}
          width="85px"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
    </FormControl>
  );
};

export default memo(SettingTimerField);
