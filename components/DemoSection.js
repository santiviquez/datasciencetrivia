import React from "react";
import {
  Flex,
  Box,
  Button,
  Heading,
  Text,
  Container,
  Stack,
  List,
  ListItem,
  ListIcon,
  LinkOverlay,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import Demo from "./Demo";

const DemoSection = () => (
  <Flex
    direction="column"
    width="100%"
    px={{ base: 5, lg: 40 }}
    pt={[20, 20]}
    id="demo"
  >
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
            Test your Knowledge
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

    <Stack
      direction={["column", "row"]}
      spacing={["10px", "80px"]}
      mt={10}
      alignSelf="center"
      //   width={"80%"}
      //   alignItems={{ base: "center" }}
    >
      <Demo></Demo>
      <Container
        marginTop={[4, 4, 4, 12, 12]}
        borderRadius="10"
        border="1px"
        borderColor="gray.200"
        p={8}
        // height="400px"
        // width="450px"
      >
        <Heading alignSelf="center" pb={4}>
          Lifetime access
        </Heading>
        <Text pb={4}>
          Practice your machine learning, deep learning and stats knowledge with
          more than 190 questions speciacially crafted for you to ace your next
          interview.
        </Text>
        <Flex flexDirection="column" alignItems="center">
          <Text fontSize="xl" as="b">
            Pay once, own it forever.
          </Text>
          <Flex flexDirection={"row"} alignItems="baseline">
            <Heading size="2xl" pt={4}>
              $10
            </Heading>
            <Text pl={2} color="GrayText" fontWeight={"black"}>
              USD
            </Text>
          </Flex>
          <Button
            // rightIcon={<ExternalLinkIcon mb="4px" />}
            fontSize="x-large"
            size="lg"
            width={{ base: "100%", lg: "70%" }}
            height="80px"
            mt={6}
            backgroundColor="#F6A0D1"
            fontWeight="bold"
            border="4px"
            borderColor="black"
            _hover={{ bg: "#F6B6DB" }}
            _active={{
              bg: "#F6ABD6",
              transform: "scale(0.95)",
            }}
          >
            <LinkOverlay href="https://santiviquez.gumroad.com/l/datasciencetrivia">
              Unlock Full Version
            </LinkOverlay>
          </Button>
          <List spacing={3} width={["100%", "85%"]} pt={8}>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="#91DBCE" />
              Access to datasciencetrivia.com and it's +190 interactive trivia
              questions.
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="#91DBCE" />A zip file with all
              the questions and answers in pdf, png, jpg, Anki format and a
              print ready file!
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="#91DBCE" />
              Practice for interviews right on your phone or computer.
            </ListItem>
          </List>
        </Flex>
      </Container>
    </Stack>
  </Flex>
);

export default DemoSection;
