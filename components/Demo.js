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

import Card from "./Card";

const freeCards = [
  {
    id: "0",
    category: "ml",
    question: "What is ensemble learning?",
    answer:
      "Combining induvidual models together with the purpose of improving the predictive power of the model.",
  },
  {
    id: "1",
    category: "dl",
    question: "What is Adagrad?",
    answer:
      "A sophisticated gradient descent algorithm that rescales the gradients of each parameter, effectively giving each parameter an independent learning rate.",
  },
  {
    id: "2",
    category: "stats",
    question: "What two parameters defined a normal distribution?",
    answer: "Its mean and its standard deviation.",
  },
  {
    id: "3",
    category: "history",
    question:
      "LeCun, Cortes, and Burges compiled a very famous dataset containing 60000 images of handwritten digits. What is the name of this dataset?",
    answer: "MNIST dataset",
  },
];

const Demo = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  var [index, setIndex] = useState(0);
  const [dificulty, setDificulty] = useState([0, 0, 0]);

  function nextCard() {
    if (index != freeCards.length - 1) {
      setIndex(++index);
      setDificulty([0, 0, 0]);
      onClose();
    }
  }
  function previousCard() {
    if (index != 0) {
      setIndex(--index);
      setDificulty([0, 0, 0]);
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
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      paddingTop={[4, 4, 4, 12, 12]}
    >
      <Flex flexDirection="row">
        <IconButton
          onClick={(e) => previousCard()}
          size="lg"
          icon={<FaChevronLeft />}
          colorScheme="teal"
          variant="link"
          fontSize="25px"
          pr={[2, 8]}
          isDisabled={index == 0 ? true : false}
        ></IconButton>
        {freeCards ? (
          <Card
            category={freeCards[index].category}
            question={freeCards[index].question}
            answer={freeCards[index].answer}
            proposedBy={freeCards[index].proposed_by}
            isOpen={isOpen}
          />
        ) : null}

        <IconButton
          onClick={(e) => nextCard()}
          size="lg"
          icon={<FaChevronRight />}
          colorScheme="teal"
          variant="link"
          fontSize="25px"
          pl={[2, 8]}
          isDisabled={index == freeCards?.length - 1 ? true : false}
        ></IconButton>
      </Flex>
      <Flex flexDirection="row" pt="8">
        <Button onClick={onToggle}>Show Answer</Button>
      </Flex>
      <ButtonGroup variant="ghost" spacing="4" pt={[4, 6]}>
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
  );
};
export default Demo;
