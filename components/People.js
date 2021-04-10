import React from "react";
import {
  ChakraProvider,
  Flex,
  Box,
  Text,
  Icon,
  Avatar,
} from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";

const People = ({ name, bio, photoUrl, twitterUrl }) => (
  <Flex
    alignItems="center"
    justifyContent="flex-start"
    width={{ base: "100%", lg: "400px" }}
  >
    <Box>
      <Avatar width="82px" height="82px" src={photoUrl} />
    </Box>
    <Flex
      flexDirection="column"
      alignItems="flex-start"
      ml={{ base: 2, lg: 4 }}
    >
      <Flex alignItems="flex-start">
        <Text fontSize="lg" fontWeight="bold">
          {name}
        </Text>
        <a target="_blank" rel="noopener noreferrer" href={twitterUrl}>
          <Icon as={FaTwitter} ml={2} color="#1DA1F2"></Icon>
        </a>
      </Flex>
      <Text mt={1} lineHeight="5">
        {bio}
      </Text>
    </Flex>
  </Flex>
);

export default People;
