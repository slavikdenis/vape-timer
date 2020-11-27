import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../styling/theme';
import { SettingsProvider } from '../context/settings';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider resetCSS theme={theme}>
    <SettingsProvider>
      <Component {...pageProps} />
    </SettingsProvider>
  </ChakraProvider>
);

export default MyApp;
