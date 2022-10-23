import React from "react";
import { Flex, Box, Heading, Text, Avatar, Icon, Link } from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";

const AuthorSection = () => (
  <Flex direction="column" width="100%" px={{ base: 5, lg: 40 }} pt={20}>
    <Flex
      display={{ lg: "flex" }}
      width="100%"
      direction={{ base: "column", lg: "row" }}
      justifyContent={{ base: "center", lg: "space-between" }}
      alignItems={{ base: "center", lg: "strech" }}
    >
      <Box width="auto" maxW="1000px">
        <Box>
          <Heading mt={{ md: 4 }} size="2xl">
            About The Author
          </Heading>
          <Box
            width={{ base: "80%", lg: "65%" }}
            mt={-4}
            height="6"
            backgroundColor="#BB92D4"
          ></Box>
        </Box>
      </Box>
    </Flex>

    <Flex
      mt={10}
      direction={{ base: "column", lg: "row" }}
      justifyContent="flex-start"
      alignItems={{ base: "center" }}
    >
      <Avatar
        height="246px"
        width="246px"
        src="/santiago_photo.jpg"
        alt="Santiago Viquez"
      />

      <Flex
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        ml={{ base: 2, lg: 10 }}
        mt={{ base: 10, lg: 0 }}
      >
        <Flex alignItems="flex-start">
          <Text fontSize="lg" fontWeight="bold">
            Hi! I'm Santiago
          </Text>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={"https://twitter.com/santiviquez"}
          >
            <Icon as={FaTwitter} ml={2} color="#1DA1F2"></Icon>
          </a>
        </Flex>
        <Text mt={1} lineHeight="5">
          I'm{" "}
          <Link
            href="https://santiviquez.com/"
            textDecor={"underline"}
            isExternal
          >
            Santiago Víquez
          </Link>
          , a physicist turned data scientist. Creator of Data Science Trivia a
          Q&A card game to learn key data science concepts by playing. Over the
          last 4 years I've been working as a data scientist at startups and 500
          fortune companies. And a lot of what I've learned is on those cards.
        </Text>
        <Text mt={4} lineHeight="5">
          I built data science trivia with two intentions in mind. Create a fun
          trivia game and practice complex data science concepts while doing it.
          I hope you enjoy playing the game as much I enjoyed creating it. If
          you have any questions about the game please contact me on twitter.
        </Text>
      </Flex>
    </Flex>
  </Flex>
);

export default AuthorSection;
