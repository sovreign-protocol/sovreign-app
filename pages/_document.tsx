import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />

        <body className="bg-primary antialiased text-white">
          <Main />

          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
