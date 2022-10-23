import React from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import Faq from "./Faq";
import Image from "next/image";
import dl_card from "../public/dl_card-9.png";
import history_card from "../public/history_card-6.png";

const FaqSection = () => (
  <Flex direction="column" width="100%" px={{ base: 5, lg: 40 }} pt={[4, 20]}>
    <Flex
      display={{ lg: "flex" }}
      width="100%"
      direction={{ base: "column", lg: "row" }}
      justifyContent={{ base: "center", lg: "space-between" }}
      alignItems={{ base: "center", lg: "strech" }}
    >
      <Box width="auto" maxW="600px">
        <Heading size="2xl" fontWeight="bold">
          Frequently Asked
        </Heading>
        <Box mb={10}>
          <Heading mt={{ md: 4 }} size="2xl">
            Questions
          </Heading>
          <Box
            width={{ base: "80%", lg: "65%" }}
            mt={-4}
            height="6"
            backgroundColor="#EFAAAD"
          ></Box>
        </Box>
        <Faq
          question="How many questions does the game have?"
          answer="197 and growing. If I come up with new questions in any of these categories: Machine Learning, Statistics, Deep Learning and History I will send them to you. You do NOT need to pay again for an updated version."
        ></Faq>
        <Faq
          question="How many categories are there?"
          answer="Four. Machine Learning, Statistics, Deep Learning and History."
        ></Faq>
        <Faq
          question="What do I get if I buy it?"
          answer="Access to datasciencetrivia.com and its +190 interactive trivia questions. Plus a zip file with all the questions and answers in pdf, png, jpg, and Anki format and a print-ready file!"
        ></Faq>
      </Box>

      <Flex
        justifyContent={{ base: "center", lg: "flex-start" }}
        display={{ base: "none", lg: "inherit" }}
        flexShrink={0}
        ml={{ md: 10 }}
        mt={{ base: 6, lg: 0 }}
      >
        <Image
          height={444}
          width={317}
          src={dl_card}
          alt="Data Science Trivia Card Deep Learning"
        />
      </Flex>
    </Flex>
    <Flex
      direction={{ base: "column", lg: "row" }}
      justifyContent="space-between"
    >
      <Flex
        direction="column"
        display={{ base: "none", lg: "inherit" }}
        justifyContent={{ base: "center", lg: "flex-start" }}
        flexShrink={0}
      >
        <Image
          height={444}
          width={317}
          src={history_card}
          alt="Data Science Trivia Card History"
        />
      </Flex>
      <Flex direction="column" width={{ base: "100%", lg: "60%" }}>
        <Faq
          question="Is there a physical version?"
          answer="Not yet. Maybe someday but it is quite expensive. However, selling this version is how I kickstart the physical one."
        ></Faq>
        <Faq
          question="I want the game but right now I can't afford it."
          answer="Don't worry, just reach out to me at twitter.com/santiviquez and I'll send you a free copy of the digital version."
        ></Faq>
        <Faq
          question="What's the refund policy?"
          answer="If what you see is not what you expected, just reply to the download email within 30 days, and you'll get a full refund. No questions asked."
        ></Faq>
      </Flex>
    </Flex>
  </Flex>
);

export default FaqSection;
