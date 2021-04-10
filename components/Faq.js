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

const Faq = ({ question, answer }) => (
  <Box mb={10}>
    <Text fontSize="2xl" fontWeight="bold">
      {question}
    </Text>
    <Text color="#636262" fontWeight="normal" fontSize="large" mt={2}>
      {answer}
    </Text>
  </Box>
);

export default Faq;
