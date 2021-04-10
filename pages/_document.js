import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap"
            rel="stylesheet"
          />
          <meta charSet="utf-8" />
          <title>Data Science Trivia - Learn Data Science The Fun Way</title>
          <meta
            name="description"
            content="Prepare for an interview or test your knowlege with Data Science Trivia."
          />

          {/* Twitter */}
          <meta name="twitter:card" content="summary" key="twcard" />
          <meta
            name="twitter:description"
            content="Prepare for an interview or test your knowlege with Data Science Trivia. 197 Q&A to practice the most common and challenging interview questions."
            key="twcard"
          />
          <meta name="twitter:creator" content="santiviquez" key="twhandle" />

          {/* Open Graph */}
          <meta property="og:url" content="datasciencetrivia.com" key="ogurl" />
          <meta
            property="og:image"
            content="./data_science_trivia_open_graph.jpg"
            key="ogimage"
          />
          <meta
            property="og:site_name"
            content="Data Science Trivia"
            key="ogsitename"
          />

          <meta
            property="og:title"
            content="Data Science Trivia - Learn Data Science The Fun Way"
            key="ogtitle"
          />

          <meta
            property="og:description"
            content="Prepare for an interview or test your knowlege with Data Science Trivia."
            key="ogdesc"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
