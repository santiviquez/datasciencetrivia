import React from "react";
import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Link,
  Icon,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FaGithub, FaHeart, FaMedium, FaTwitter } from "react-icons/fa";

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
        <Icon as={FaTwitter} mx={2} color="#939393"></Icon>
      </a>

      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://santiviquez.medium.com/"
      >
        <Icon as={FaMedium} mx={2} color="#939393"></Icon>
      </a>
    </Flex>
  </Flex>
);

export default Footer;
