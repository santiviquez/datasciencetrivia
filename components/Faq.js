import React from "react";
import { Box, Text } from "@chakra-ui/react";

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
