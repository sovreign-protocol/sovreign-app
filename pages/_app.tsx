import Navigation from "@/components/navigation";
import { useEagerConnect } from "@/hooks/useEagerConnect";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEagerConnect();

  return (
    <>
      <Head>
        <title>Sovreign</title>
        <meta name="description" content="The future-looking SDR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
