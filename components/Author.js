import { Flex, Text, Icon, Link } from "@chakra-ui/react";
import { FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";

const Author = () => {
  return (
    <Flex
      position="absolute"
      bottom={12}
      alignSelf="center"
      p={6}
      color="GrayText"
      fontSize="sm"
    >
      <Flex flexDirection="column" alignItems="center">
      <Flex flexDirection="row">
        <Text>Created by santiviquez</Text>
        <Link href="https://twitter.com/santiviquez/" isExternal>
            <Icon as={FaSquareXTwitter} ml={2} color="black"></Icon>
        </Link>        
        <Link href="https://twitter.com/santiviquez/" isExternal>
        <Icon as={FaLinkedin} ml={2} color="black"></Icon>
        </Link>
        </Flex>
        <Text fontSize="11px" color="RGBA(0, 0, 0, 0.24)" pt={2}>To suggest new questions or report an error send me a dm.</Text>
      </Flex>
    </Flex>
  );
};

export default Author;