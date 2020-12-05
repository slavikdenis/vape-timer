import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
  FormHelperText,
  Tag,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/react';
import { memo } from 'react';

import CircleButton from '../../components/CircleButton';
import InfoIcon from '../../components/icons/InfoIcon';

import {
  DEFAULT_BLAZE_TIME,
  DEFAULT_HEATING_TIME,
  useSettingsContext,
} from '../../context/settings';
import { useScreenWakeLock, useVibrate } from '../../utils/hooks';

const SettingsContent = () => {
  // Vibrations API
  const { isSupported: isVibSupported } = useVibrate();

  // Screen Wake Lock API
  const { isSupported: isSWLSupported } = useScreenWakeLock();

  // Settings context
  const {
    setSetting,
    blazeTime,
    heatingTime,
    screenWakeLock,
    vibrations,
  } = useSettingsContext();

  return (
    <Box>
      <Box w="100%" mb={4}>
        <FormLabel mt={2} mb={4} as="h3" fontSize="xl">
          Timers
        </FormLabel>

        <FormControl id="heating-timer" mb={4}>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Popover>
                <PopoverTrigger>
                  <CircleButton size={30} borderWidth={2}>
                    <InfoIcon width={24} height={24} />
                  </CircleButton>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Heating timer</PopoverHeader>
                  <PopoverBody>
                    <FormHelperText>
                      Time for your vaped material to heat up.
                      <br />
                      Suggested value is{' '}
                      <Tag colorScheme="green">{DEFAULT_HEATING_TIME}</Tag>{' '}
                      seconds.
                    </FormHelperText>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <FormLabel whiteSpace="nowrap" mb={0} pl={3}>
                Heating timer
              </FormLabel>
            </Flex>

            <NumberInput
              id="heating-timer"
              value={heatingTime}
              min={5}
              max={90}
              onChange={(_s, number) =>
                setSetting('heatingTime', Number.isNaN(number) ? 5 : number)
              }
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

        <FormControl id="blaze-timer">
          <Flex mb={4} alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Popover>
                <PopoverTrigger>
                  <CircleButton size={30} borderWidth={2}>
                    <InfoIcon width={24} height={24} />
                  </CircleButton>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Blaze timer</PopoverHeader>
                  <PopoverBody>
                    <FormHelperText>
                      Time for you to inhale. Inhale slowly and longer for
                      better effect.
                      <br />
                      Suggested value is value is{' '}
                      <Tag colorScheme="green">{DEFAULT_BLAZE_TIME}</Tag>{' '}
                      seconds.
                    </FormHelperText>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <FormLabel whiteSpace="nowrap" mb={0} pl={3}>
                Blaze timer
              </FormLabel>
            </Flex>

            <NumberInput
              id="blaze-timer"
              value={blazeTime}
              min={4}
              max={90}
              onChange={(_s, number) =>
                setSetting('blazeTime', Number.isNaN(number) ? 5 : number)
              }
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
      </Box>

      <Box w="100%" mb={4}>
        <FormLabel mb={4} as="h3" fontSize="xl">
          Features
        </FormLabel>

        <FormControl id="screen-wake-lock">
          <Flex mb={4} alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Popover>
                <PopoverTrigger>
                  <CircleButton size={30} borderWidth={2}>
                    <InfoIcon width={24} height={24} />
                  </CircleButton>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Screen Wake Lock</PopoverHeader>
                  <PopoverBody>
                    <FormHelperText>
                      Prevents your device screen from dimming/locking when
                      timer is running.
                    </FormHelperText>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <FormLabel whiteSpace="nowrap" mb={0} pl={3}>
                Screen Wake Lock
              </FormLabel>
            </Flex>

            <Switch
              id="screen-wake-lock"
              onChange={(e) => setSetting('screenWakeLock', e.target.checked)}
              isChecked={screenWakeLock}
              colorScheme="green"
              size="lg"
              disabled={isSWLSupported}
            />
          </Flex>
        </FormControl>

        <FormControl id="vibrations">
          <Flex mb={4} alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <Popover>
                <PopoverTrigger>
                  <CircleButton size={30} borderWidth={2}>
                    <InfoIcon width={24} height={24} />
                  </CircleButton>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Vibrations</PopoverHeader>
                  <PopoverBody>
                    <FormHelperText>
                      Vibrates your device every time when{' '}
                      <Tag colorScheme="green">Blaze</Tag> phase starts.
                    </FormHelperText>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <FormLabel whiteSpace="nowrap" mb={0} pl={3}>
                Vibrations
              </FormLabel>
            </Flex>

            <Switch
              id="vibrations"
              onChange={(e) => setSetting('vibrations', e.target.checked)}
              isChecked={vibrations}
              colorScheme="green"
              size="lg"
              disabled={isVibSupported}
            />
          </Flex>
        </FormControl>
      </Box>
    </Box>
  );
};

export default memo(SettingsContent);
