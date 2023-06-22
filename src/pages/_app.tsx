import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import { SettingsProvider } from '../context/settings';
import Head from 'next/head';
import theme from '../styling/theme';
import { TimerProvider } from '../context/timer';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>VapeTimer</title>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      <meta name="application-name" content="Vape Timer" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Vape Timer" />
      <meta name="description" content="Timer for your vaping session" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#38a169" />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/icons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/icons/favicon-16x16.png"
      />

      <link rel="manifest" href="/manifest.json" />

      <link rel="shortcut icon" href="/icons/favicon-96x96.png" />

      <meta name="twitter:card" content="Timer for your vaping session" />
      <meta name="twitter:url" content="https://vape-timer.vercel.app" />
      <meta name="twitter:title" content="Vape Timer" />
      <meta
        name="twitter:description"
        content="Vape Timer - Timer for your vaping session"
      />
      <meta
        name="twitter:image"
        content="https://vape-timer.vercel.app/icons/android-chrome-192x192.png"
      />
      <meta name="twitter:creator" content="@toren_slavik" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Vape Timer" />
      <meta property="og:description" content="Timer for your vaping session" />
      <meta property="og:site_name" content="Vape Timer" />
      <meta property="og:url" content="https://vape-timer.vercel.app" />
      <meta
        property="og:image"
        content="https://vape-timer.vercel.app/icons/apple-icon-180x180.png"
      />
    </Head>

    <ChakraProvider resetCSS theme={theme}>
      <SettingsProvider>
        <TimerProvider>
          <Component {...pageProps} />
        </TimerProvider>
      </SettingsProvider>
    </ChakraProvider>
  </>
);

export default MyApp;
