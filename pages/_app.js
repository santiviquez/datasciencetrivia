import Head from "next/head";
import Script from "next/script";

import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "../styles/theme";
import "@fontsource/maven-pro/900.css";
import "@fontsource/poppins/400.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        defer
        data-domain="datasciencetrivia.com"
        src="https://plausible.io/js/plausible.js"
      ></Script>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* HTML Meta Tags */}
        <title>Data Science Trivia - Learn Data Science The Fun Way</title>
        <meta
          name="description"
          content="Prepare for an interview or test your knowledge with Data Science Trivia. 197 Q&A to practice the most common and challenging interview questions."
        />
        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://www.datasciencetrivia.com/" />
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
          content="https://ds-trivia-site.vercel.app/data_science_trivia_open_graph.jpg"
        />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="ds-trivia-site.vercel.app" />
        <meta name="twitter:creator" content="santiviquez" />
        <meta
          property="twitter:url"
          content="https://www.datasciencetrivia.com/"
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
          content="https://ds-trivia-site.vercel.app/data_science_trivia_open_graph.jpg"
        />
        <title>Data Science Trivia - Learn Data Science The Fun Way</title>
        <meta
          name="description"
          content="Prepare for an interview or test your knowledge with Data Science Trivia."
        />{" "}
      </Head>
      <ChakraProvider theme={customTheme}>
          <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
export default MyApp;
