import Image from "next/image";
import {
  Flex,
  Text,
  Fade,
  Skeleton,
  SkeletonText,
  Icon,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";

import { useUser } from "../context/user";

const Card = ({ category, question, answer, proposedBy, isOpen, loading }) => {
  var categoryName = "ml";
  var patternImg = "/ml_pattern.svg";
  var color = "#72D0EA";
  switch (category) {
    case "ml":
      categoryName = "Machine Learning";
      patternImg = "/ml_pattern.svg";
      color = "#72D0EA";
      break;
    case "dl":
      categoryName = "Deep Learning";
      patternImg = "/dl_pattern.svg";
      color = "#EFAAAD";
      break;
    case "history":
      categoryName = "History";
      patternImg = "/hist_pattern.svg";
      color = "#BB92D4";
      break;
    case "stats":
      categoryName = "Statistics";
      patternImg = "/stats_pattern.svg";
      color = "#92DCCF";
      break;
  }
  const { user } = useUser();
  return (
    <VStack>
      {!user?.is_subscribed ? (
        <Badge alignSelf="start" colorScheme="purple">
          Free Sample
        </Badge>
      ) : (
        <Badge alignSelf="start">{""}</Badge>
      )}

      <Flex
        direction="column"
        borderWidth="10px"
        height="448px"
        width="320px"
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
            paddingLeft={4}
            paddingRight={4}
          >
            {loading ? (
              <Skeleton height="20px" />
            ) : (
              <Text
                fontSize="25px"
                fontFamily="Maven Pro"
                lineHeight="7"
                textTransform="uppercase"
              >
                {categoryName}
              </Text>
            )}
          </Flex>

          {category == "ml" ? (
            <Flex
              flexDirection="column"
              width="100px"
              backgroundColor={color}
              justifyContent="center"
            >
              <Image
                height={100}
                width={100}
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
        <Flex flexDirection="column" height="330px" maxHeight="330px">
          {loading ? (
            <SkeletonText fontSize="16px" p={4} noOfLines={3} spacing="4" />
          ) : (
            <Flex>
              {question.length < 105 ? (
                <Text
                  padding={4}
                  fontSize="20px"
                  fontFamily="Maven Pro"
                  textTransform="uppercase"
                  lineHeight="7"
                >
                  {question}
                </Text>
              ) : (
                <Text
                  padding={4}
                  fontSize="13px"
                  fontFamily="Maven Pro"
                  textTransform="uppercase"
                  lineHeight="7"
                >
                  {question}
                </Text>
              )}
            </Flex>
          )}
          <Fade in={isOpen} unmountOnExit={true}>
            <Skeleton isLoaded={!loading}>
              <Text px={4} fontSize="16px" fontFamily="Poppins">
                {answer}
              </Text>
            </Skeleton>
          </Fade>
        </Flex>
        {proposedBy ? (
          <Flex
            flexDirection="row"
            padding={4}
            fontSize="12px"
            alignItems={"center"}
          >
            <Text pr={1}>{"Proposed by: "}</Text>
            <Text pr={1}>{proposedBy}</Text>
            <Icon as={FaTwitter} color="#1DA1F2"></Icon>
          </Flex>
        ) : null}

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
    </VStack>
  );
};

export default Card;
