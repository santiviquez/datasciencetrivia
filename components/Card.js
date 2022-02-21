import Image from "next/image";
import { Flex, Text } from "@chakra-ui/react";

const Card = ({ category, question, answer }) => {
  var patternImg = "/ml_pattern.svg";
  var color = "#72D0EA";
  switch (category) {
    case "machine learning":
      patternImg = "/ml_pattern.svg";
      color = "#72D0EA";
      break;
    case "deep learning":
      patternImg = "/dl_pattern.svg";
      color = "#EFAAAD";
      break;
    case "history":
      patternImg = "/hist_pattern.svg";
      color = "#BB92D4";
      break;
    case "statistics":
      patternImg = "/stats_pattern.svg";
      color = "#92DCCF";
      break;
  }
  return (
    <Flex
      direction="column"
      borderWidth="10px"
      height="490px"
      width="350px"
      borderColor="black"
    >
      <Flex
        flexDirection="row"
        width="100%"
        height="100px"
        borderBottomWidth="10px"
        borderColor="black"
      >
        <Flex
          flexDirection="column"
          width="250px"
          borderRightWidth="10px"
          borderColor="black"
          justifyContent="center"
          paddingLeft={6}
        >
          <Text
            fontSize="25px"
            fontFamily="Maven Pro"
            lineHeight="7"
            textTransform="uppercase"
          >
            {category}
          </Text>
        </Flex>

        {category == "machine learning" ? (
          <Flex
            flexDirection="column"
            width="100px"
            backgroundColor={color}
            justifyContent="center"
          >
            <Image
              height={80}
              width={80}
              src={patternImg}
              alt="pattern image"
            />
          </Flex>
        ) : (
          <Flex flexDirection="column" width="100px" backgroundColor={color}>
            <Image
              height={100}
              width={100}
              src={patternImg}
              alt="pattern image"
              objectFit="cover"
            />
          </Flex>
        )}
      </Flex>
      <Text
        height="330px"
        maxHeight="330px"
        padding={6}
        fontSize="25px"
        fontFamily="Maven Pro"
        textTransform="uppercase"
      >
        {question}
      </Text>
      <Flex
        flexDirection="column"
        borderTopWidth="10px"
        borderTopColor="black"
        backgroundColor={color}
        alignItems="flex-end"
        paddingRight="3"
        paddingTop="2"
      >
        <Text fontSize="small" fontWeight="semibold" height="28px">
          datasciencetrivia.com
        </Text>
      </Flex>
    </Flex>
  );
};

export default Card;
