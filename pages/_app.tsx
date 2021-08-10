import Navigation from "@/components/navigation";
import { useEagerConnect } from "@/hooks/useEagerConnect";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEagerConnect();

  return (
    <>
      <Head>
        <title>Sovreign</title>
        <meta name="description" content="The future-looking SDR" />
      </Head>

      <Navigation />

      <main>
        <Component {...pageProps} />
      </main>

      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
}

export default MyApp;
