import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { useUser } from "../context/user";

const AccountMenu = () => {
  const { user } = useUser();

  return (
    <HStack justifyContent="end" pb={3}>
      {!user?.is_subscribed ? (
        <Button
          backgroundColor="#F6A0D1"
          fontWeight="bold"
          border="2px"
          borderColor="black"
          _hover={{ bg: "#F6B6DB" }}
          _active={{
            bg: "#F6ABD6",
            transform: "scale(0.95)",
          }}
          // onClick={onOpen}
        >
          Get Full Version
        </Button>
      ) : null}
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Account
        </MenuButton>
        <MenuList>
          <MenuItem>Download digital version</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
};

export default AccountMenu;
