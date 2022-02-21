import Image from "next/image";
import { Button, Flex, Text, IconButton, ButtonGroup } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BiHappy, BiMeh, BiSad } from "react-icons/bi";

import Card from "../components/Card";

const Game = () => {
  return (
    <Flex
      direction="column"
      borderWidth={["10px", "15px", "15px", "15px"]}
      borderTopColor="#72D0EA"
      borderLeftColor="#91DBCE"
      borderRightColor="#EFAAAD"
      borderBottomColor="#BB92D4"
      width="100%"
      pb="4"
    >
      <Flex flexDirection="column" alignItems="center" pt="12">
        <Flex flexDirection="row">
          <IconButton
            size="lg"
            icon={<FaChevronLeft />}
            colorScheme="teal"
            variant="link"
            fontSize="25px"
            pr="8"
          ></IconButton>
          <Card
            category={"machine learning"}
            question={"What is ensemble learning?"}
          ></Card>
          <IconButton
            size="lg"
            icon={<FaChevronRight />}
            colorScheme="teal"
            variant="link"
            fontSize="25px"
            pl="8"
          ></IconButton>
        </Flex>
        <Flex flexDirection="row" pt="8">
          <Button> Show Answer</Button>
        </Flex>
        <ButtonGroup variant="ghost" spacing="4" pt="8">
          <Button leftIcon={<BiHappy />} colorScheme="green">
            Easy
          </Button>
          <Button leftIcon={<BiMeh />} colorScheme="blackAlpha">
            Neutral
          </Button>
          <Button leftIcon={<BiSad />} colorScheme="red">
            Hard
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};

export default Game;
