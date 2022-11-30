import { extendTheme, useTheme as useChakraTheme } from '@chakra-ui/react';
import { GlobalStyles } from '@chakra-ui/theme-tools';

const styles: GlobalStyles = {
  global: {
    body: {
      height: '100%',
    },
    svg: {
      display: 'inline-flex',
    },
  },
};

const theme = extendTheme({
  config: {
    useSystemColorMode: true,
    initialColorMode: 'dark',
  },
  styles,
});

export type Theme = typeof theme;

export const useTheme = () => useChakraTheme<Theme>();

export default theme;
