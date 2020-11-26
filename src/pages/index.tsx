import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';

const DynamicTimer = dynamic(() => import('../components/timer'));

export default function App() {
  return (
    <Fragment>
      <Head>
        <title>VapeTimer</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <DynamicTimer />
    </Fragment>
  );
}
