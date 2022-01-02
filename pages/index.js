import React from "react";
import { Flex } from "@chakra-ui/react";
import Section from "../components/Section";
import PeopleSection from "../components/PeopleSection";
import FaqSection from "../components/FaqSection";
import AuthorSection from "../components/AuthorSection";
import Footer from "../components/Footer";
import Script from "next/script";

const App = () => {
  return (
    <Flex
      direction="column"
      borderWidth="15px"
      borderTopColor="#72D0EA"
      borderLeftColor="#91DBCE"
      borderRightColor="#EFAAAD"
      borderBottomColor="#BB92D4"
      width="100%"
      pb="4"
    >
      <Script src="https://gumroad.com/js/gumroad.js"></Script>
      <Section></Section>
      <PeopleSection></PeopleSection>
      <FaqSection></FaqSection>
      <AuthorSection></AuthorSection>
      <Footer></Footer>
    </Flex>
  );
};

export default App;
