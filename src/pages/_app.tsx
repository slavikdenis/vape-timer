import React from 'react';
import 'normalize.css';
import { AppProps } from 'next/app';
import { GlobalStyles } from '../styling';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    {GlobalStyles}
    <Component {...pageProps} />
  </>
);

export default MyApp;
