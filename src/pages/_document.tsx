import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';
import theme from '../styling/theme';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <style>{`
            html, body, #__next {
              height: 100%;
            }
            #__next {
              margin: 0 auto;
            }
            `}</style>
        </Head>

        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
