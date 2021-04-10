import React from "react";
import { Flex } from "@chakra-ui/react";
import People from "./People";

const PeopleWall = () => (
  <Flex direction="column" width="100%">
    <Flex mt={6} alignSelf={{ base: "center", lg: "flex-start" }}>
      <People
        name="Jesse Mostipak"
        bio="Data Science Evangelist at RStudio former Community Advocate at Kaggle."
        photoUrl="./jesse.jpg"
        twitterUrl="https://twitter.com/kierisi"
      ></People>
    </Flex>
    <Flex mt={6} alignSelf={{ base: "center", lg: "flex-end" }}>
      <People
        name="Goku Mohandas"
        bio="Founder of madewithml.com. AI research at Apple and Author at OReilly Media."
        photoUrl="./goku.jpg"
        twitterUrl="https://twitter.com/GokuMohandas"
      ></People>
    </Flex>
    <Flex mt={6} alignSelf={{ base: "center", lg: "flex-start" }}>
      <People
        name="Rachael Tatman"
        bio="Developer Advocate at Rasa. Kaggle Grandmaster and former Developer Advocate at Kaggle."
        photoUrl="./rachael.jpg"
        twitterUrl="https://twitter.com/rctatman"
      ></People>
    </Flex>
    <Flex mt={6} alignSelf={{ base: "center", lg: "flex-end" }}>
      <People
        name="Alexey Grigorev"
        bio="Lead Data Scientist at OLX Group and author of Machine Learning Bookcamp."
        photoUrl="./alexey.jpg"
        twitterUrl="https://twitter.com/Al_Grigor"
      ></People>
    </Flex>
    <Flex mt={6} alignSelf={{ base: "center", lg: "flex-start" }}>
      <People
        name="Santiago Valdarrama"
        bio="Teaches Machine Learning on Twitter."
        photoUrl="./santiago.jpg"
        twitterUrl="https://twitter.com/svpino"
      ></People>
    </Flex>
  </Flex>
);

export default PeopleWall;
