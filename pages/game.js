import React, { useState } from "react";
import {
  Button,
  Flex,
  IconButton,
  ButtonGroup,
  useDisclosure,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BiHappy, BiMeh, BiSad } from "react-icons/bi";
import useMousetrap from "react-hook-mousetrap";
import Card from "../components/Card";

const cards = {
  cards: [
    {
      id: "0",
      category: "machine learning",
      question: "hola",
      answer: "chao",
    },
    {
      id: "1",
      category: "deep learning",
      question: "hola deep",
      answer: "chao deep",
    },
  ],
};

const Game = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  var [index, setIndex] = useState(0);
  const [dificulty, setDificulty] = useState([0, 0, 0]);
  function nextCard() {
    if (index != cards.cards.length - 1) {
      setIndex(++index);
      onClose();
    }
  }
  function previousCard() {
    if (index != 0) {
      setIndex(--index);
      onClose();
    }
  }

  function setDificultyValue(e) {
    switch (e) {
      case "easy":
        setDificulty([1, 0, 0]);
        break;
      case "neutral":
        setDificulty([0, 1, 0]);
        break;
      case "hard":
        setDificulty([0, 0, 1]);
        break;
      default:
        setDificulty([0, 0, 0]);
        break;
    }
  }

  useMousetrap("right", () => {
    nextCard();
  });

  useMousetrap("left", () => {
    previousCard();
  });

  useMousetrap("space", () => {
    onToggle();
  });

  useMousetrap("e", () => {
    setDificultyValue("easy");
  });

  useMousetrap("n", () => {
    setDificultyValue("neutral");
  });

  useMousetrap("h", () => {
    setDificultyValue("hard");
  });
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
            onClick={(e) => previousCard()}
            size="lg"
            icon={<FaChevronLeft />}
            colorScheme="teal"
            variant="link"
            fontSize="25px"
            pr="8"
            isDisabled={index == 0 ? true : false}
            // _focus="none"
          ></IconButton>
          <Card
            category={cards.cards[index].category}
            question={cards.cards[index].question}
            answer={cards.cards[index].answer}
            isOpen={isOpen}
          ></Card>
          <IconButton
            onClick={(e) => nextCard()}
            size="lg"
            icon={<FaChevronRight />}
            colorScheme="teal"
            variant="link"
            fontSize="25px"
            pl="8"
            isDisabled={index == cards.cards.length - 1 ? true : false}
          ></IconButton>
        </Flex>
        <Flex flexDirection="row" pt="8">
          <Button onClick={onToggle}>Show Answer</Button>
        </Flex>
        <ButtonGroup variant="ghost" spacing="4" pt="8">
          <Button
            leftIcon={<BiHappy />}
            colorScheme="green"
            onClick={() => setDificultyValue("easy")}
            variant={dificulty[0] == 1 ? "solid" : "ghost"}
            _focus={{
              boxShadow: "none",
            }}
          >
            Easy
          </Button>
          <Button
            leftIcon={<BiMeh />}
            colorScheme="blackAlpha"
            onClick={() => setDificultyValue("neutral")}
            variant={dificulty[1] == 1 ? "solid" : "ghost"}
            _focus={{
              boxShadow: "none",
            }}
          >
            Neutral
          </Button>
          <Button
            leftIcon={<BiSad />}
            colorScheme="red"
            onClick={() => setDificultyValue("hard")}
            variant={dificulty[2] == 1 ? "solid" : "ghost"}
            _focus={{
              boxShadow: "none",
            }}
          >
            Hard
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};

export default Game;
