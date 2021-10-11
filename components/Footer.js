import React from "react";
import { Flex, Icon } from "@chakra-ui/react";
import { FaMedium, FaTwitter } from "react-icons/fa";

const Footer = () => (
  <Flex width="100%" px={{ base: 5, lg: 40 }} pt="80px">
    <Flex
      width="100%"
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://twitter.com/santiviquez"
      >
        <Icon boxSize={6} as={FaTwitter} mx={4} color="#939393"></Icon>
      </a>

      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://santiviquez.medium.com/"
      >
        <Icon boxSize={6} as={FaMedium} mx={4} color="#939393"></Icon>
      </a>
    </Flex>
  </Flex>
);

export default Footer;
