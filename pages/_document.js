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

          {/* HTML Meta Tags */}
          <title>Data Science Trivia - Learn Data Science The Fun Way</title>
          <meta
            name="description"
            content="Prepare for an interview or test your knowledge with Data Science Trivia. 197 Q&A to practice the most common and challenging interview questions."
          />

          {/* Facebook Meta Tags */}
          <meta
            property="og:url"
            content="https://ds-trivia-site.vercel.app/"
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="Data Science Trivia - Learn Data Science The Fun Way"
          />
          <meta
            property="og:description"
            content="Prepare for an interview or test your knowledge with Data Science Trivia. 197 Q&A to practice the most common and challenging interview questions."
          />
          <meta
            property="og:image"
            content="./data_science_trivia_open_graph.jpg"
          />

          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="ds-trivia-site.vercel.app" />
          <meta name="twitter:creator" content="santiviquez" />
          <meta
            property="twitter:url"
            content="https://ds-trivia-site.vercel.app/"
          />
          <meta
            name="twitter:title"
            content="Data Science Trivia - Learn Data Science The Fun Way"
          />
          <meta
            name="twitter:description"
            content="Prepare for an interview or test your knowledge with Data Science Trivia. 197 Q&A to practice the most common and challenging interview questions."
          />
          <meta
            name="twitter:image"
            content="/data_science_trivia_open_graph.jpg"
          />

          <title>Data Science Trivia - Learn Data Science The Fun Way</title>
          <meta
            name="description"
            content="Prepare for an interview or test your knowledge with Data Science Trivia."
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
