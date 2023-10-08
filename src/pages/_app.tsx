import '@mantine/core/styles.css';
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "../../theme";
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>SI Penghapusan Dev Helper</title>
        <meta name="description" content="Helper untuk development aplikasi SI Penghapusan" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </MantineProvider>
  )
}
