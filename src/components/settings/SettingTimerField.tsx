import { memo, ReactNode } from 'react';
import {
  Flex,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  FormHelperText,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  InputLeftElement,
  InputRightElement,
  Button,
  InputGroup,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { getDurationFromSeconds } from '../../utils/timer';

import SettingsInfoIcon from './SettingsInfoIcon';
import { isNumber } from '../../utils/utils';

type SettingTimerFieldProps = {
  fieldId: string;
  title: string;
  value: number;
  onChange: (value: number) => void;
  PopoverComponent: ReactNode;
  isDisabled?: boolean;
  minValue?: number;
  maxValue?: number;
  step?: number;
  CheckboxComponent?: ReactNode;
};

const SettingTimerField = ({
  fieldId,
  title,
  PopoverComponent,
  value,
  onChange,
  isDisabled = false,
  step = 5,
  minValue,
  maxValue,
  CheckboxComponent,
}: SettingTimerFieldProps) => {
  const formattedValue = getDurationFromSeconds(value);

  return (
    <FormControl id={fieldId} mb={4}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Popover placement="right">
            <PopoverTrigger>
              <SettingsInfoIcon />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>{title}</PopoverHeader>
              <PopoverBody>
                <FormHelperText>{PopoverComponent}</FormHelperText>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <FormLabel whiteSpace="nowrap" mb={0} pl={3}>
            {title}
          </FormLabel>
        </Flex>

        {CheckboxComponent}

        <NumberInput
          id={fieldId}
          value={formattedValue}
          min={minValue}
          max={maxValue}
          w="142px"
          keepWithinRange
          onChange={(_s, val) => onChange(val)}
        >
          <InputGroup>
            <InputLeftElement paddingLeft="0.5rem">
              <Button
                w="2rem"
                h="1.75rem"
                size="sm"
                isDisabled={
                  isDisabled || (isNumber(minValue) && value - step < minValue)
                }
                onClick={() => onChange(value - step)}
              >
                <MinusIcon />
              </Button>
            </InputLeftElement>

            <NumberInputField
              paddingX="3rem"
              disabled
              _disabled={isDisabled ? undefined : {}}
            />

            <InputRightElement paddingRight="0.5rem">
              <Button
                w="2rem"
                h="1.75rem"
                size="sm"
                isDisabled={
                  isDisabled || (isNumber(maxValue) && value + step > maxValue)
                }
                onClick={() => onChange(value + step)}
              >
                <AddIcon />
              </Button>
            </InputRightElement>
          </InputGroup>
        </NumberInput>
      </Flex>
    </FormControl>
  );
};

export default memo(SettingTimerField);
