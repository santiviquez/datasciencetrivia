import React from "react";
import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const Section = () => {
  const onOpen = ({}) => {
    window.open("https://gumroad.com/l/datasciencetrivia", "_blank");
  };

  return (
    <Flex width="100%" px={{ base: 5, lg: 40 }} pt={20}>
      <Flex
        display={{ lg: "flex" }}
        width="100%"
        direction={{ base: "column", lg: "row" }}
        justifyContent={{ base: "center", lg: "space-between" }}
        alignItems={{ base: "center", lg: "strech" }}
      >
        <Box width="auto" maxW="600px">
          <Heading size="2xl" fontWeight="bold">
            Learn Data Science
          </Heading>
          <Box>
            <Heading mt={{ md: 4 }} size="2xl">
              The Fun Way
            </Heading>
            <Box
              width={{ base: "80%", lg: "65%" }}
              mt={-4}
              height="6"
              backgroundColor="#72D0EA"
            ></Box>
          </Box>

          <Text mt={8} fontSize="2xl" fontWeight="bold">
            Prepare for an interview or test your knowledge with Data Science
            Trivia.
          </Text>
          <Text fontWeight="normal" fontSize="large" mt={8}>
            197 Q&A to practice the most common and challenging interview
            questions. From Machine Learning, Deep Learnig and Statistics to
            History (because, why not?)
          </Text>
          <Flex justifyContent={{ base: "center", lg: "flex-start" }}>
            <Button
              rightIcon={<ExternalLinkIcon mb="4px" />}
              fontSize="x-large"
              size="lg"
              width={{ base: "100%", lg: "70%" }}
              height="80px"
              mt={10}
              backgroundColor="#F6A0D1"
              fontWeight="bold"
              border="4px"
              borderColor="black"
              _hover={{ bg: "#F6B6DB" }}
              _active={{
                bg: "#F6ABD6",
                transform: "scale(0.95)",
              }}
              onClick={onOpen}
            >
              <Link isExternal>$10 Buy Now</Link>
            </Button>
          </Flex>
        </Box>
        <Flex
          justifyContent={{ base: "center", lg: "flex-start" }}
          flexShrink={0}
          ml={{ md: 10 }}
          mt={{ base: 6 }}
        >
          <Image
            height="444px"
            width="317px"
            src="/ml_card-6.png"
            alt="Data Science Trivia Card Machine Learning"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Section;
