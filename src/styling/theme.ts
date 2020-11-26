import {
  ColorModeOptions,
  extendTheme,
  useTheme as useChakraTheme,
} from '@chakra-ui/react';
import { GlobalStyles } from '@chakra-ui/theme-tools';

const config: ColorModeOptions = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const styles: GlobalStyles = {
  global: {
    svg: {
      display: 'inline-flex',
    },
  },
};

const theme = extendTheme({ config, styles });

export type Theme = typeof theme;

export const useTheme = () => useChakraTheme<Theme>();

export default theme;
