import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0c0f21" />
          <meta name="msapplication-TileColor" content="#0c0f21" />
          <meta name="theme-color" content="#0c0f21" />
        </Head>

        <body className="bg-primary antialiased text-white">
          <Main />

          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
