import { Flex, Text, Kbd, VStack } from "@chakra-ui/react";

const Keymaps = () => {
  return (
    <Flex
      flexDirection="column"
      borderRadius="8px"
      width="220px"
      position="sticky"
      bottom={6}
      alignSelf="flex-end"
      p={6}
      color="GrayText"
      fontSize="sm"
      display={{
        lg: "initial",
        md: "initial",
        sm: "none",
        base: "none",
      }}
    >
      <Flex justifyContent="flex-end">
        <VStack spacing={3} align="stretch">
          <Flex justifyContent="start">
            <Kbd mr={12}>→</Kbd>
            <Text>Next Card</Text>
          </Flex>
          <Flex justifyContent="start">
            <Kbd mr={12}>←</Kbd>
            <Text>Previous card</Text>
          </Flex>
          <Flex justifyContent="start">
            <Kbd mr={4}>space</Kbd>
            <Text>Show answer</Text>
          </Flex>
          <Flex justifyContent="start">
            <Kbd mr={12}>e</Kbd>
            <Text>Rate easy</Text>
          </Flex>
          <Flex justifyContent="start">
            <Kbd mr={12}>n</Kbd>
            <Text>Rate neutral</Text>
          </Flex>
          <Flex justifyContent="start">
            <Kbd mr={12}>h</Kbd>
            <Text>Rate hard</Text>
          </Flex>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default Keymaps;
