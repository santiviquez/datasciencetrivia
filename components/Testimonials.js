import React from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import Script from "next/script";

const Testimonials = () => (
  <Flex direction="column" width="100%" pt={20}>
    <Flex
      display={{ lg: "flex" }}
      width="100%"
      direction={{ base: "column", lg: "row" }}
      justifyContent={{ base: "center", lg: "space-between" }}
      alignItems={{ base: "center", lg: "strech" }}
      px={{ base: 5, lg: 40 }}
    >
      <Box width="auto" maxW="1000px">
        <Heading size="2xl" fontWeight="bold">
          People love
        </Heading>
        <Box>
          <Heading mt={{ md: 4 }} size="2xl">
            Data Science Trivia
          </Heading>
          <Box
            width={{ base: "60%", lg: "65%" }}
            mt={-4}
            height="6"
            backgroundColor="#F6ABD6"
          ></Box>
        </Box>
      </Box>
    </Flex>

    <Flex
      mt={10}
      direction={{ base: "column", lg: "row" }}
      justifyContent="flex-start"
      alignItems={{ base: "center" }}
      height="500px"
    >
      <iframe
        id="testimonialto-data-science-trivia-light"
        src="https://embed.testimonial.to/w/data-science-trivia?theme=light&card=base&loadMore=on&initialCount=20"
        frameborder="0"
        scrolling="yes"
        width="100%"
        height="100%"
      ></iframe>
    </Flex>
  </Flex>
);

export default Testimonials;
