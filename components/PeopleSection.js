import React from "react";
import { Flex, Box, Heading, Text } from "@chakra-ui/react";
import PeopleWall from "../components/PeopleWall";
import Image from "next/image";
import stats_card from "../public/stats_card-37.png";

const PeopleSection = () => (
  <Flex direction="column" width="100%" px={{ base: 5, lg: 40 }} pt={20}>
    <Flex
      display={{ lg: "flex" }}
      width="100%"
      direction={{ base: "column", lg: "row" }}
      justifyContent={{ base: "center", lg: "space-between" }}
      alignItems={{ base: "center", lg: "strech" }}
    >
      <Box width="auto" maxW="1000px">
        <Heading size="2xl" fontWeight="bold">
          With Questions From
        </Heading>
        <Box>
          <Heading mt={{ md: 4 }} size="2xl">
            Experienced Data Scientists
          </Heading>
          <Box
            width={{ base: "80%", lg: "65%" }}
            mt={-4}
            height="6"
            backgroundColor="#91DBCE"
          ></Box>
        </Box>
      </Box>
    </Flex>
    <Flex
      mt={10}
      direction={{ base: "column", lg: "row" }}
      justifyContent="space-between"
    >
      <Flex
        direction="column"
        justifyContent={{ base: "center", lg: "flex-start" }}
        flexShrink={0}
        mt={{ base: 6 }}
      >
        <Image
          display={{ base: "none", lg: "inherit" }}
          height={444}
          width={317}
          src={stats_card}
          alt="Data Science Trivia Card Statistics"
        />
      </Flex>
      <Flex direction="column" width={{ base: "100%", lg: "60%" }}>
        <Text mt={6} alignSelf={{ base: "center", lg: "flex-start" }}>
          More than 50 questions where submitted by known experts in the field!
        </Text>
        <PeopleWall></PeopleWall>
      </Flex>
    </Flex>
  </Flex>
);

export default PeopleSection;
