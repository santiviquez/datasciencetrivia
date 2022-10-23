import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Text,
  Link,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

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
          <NextLink href="/#demo" passHref>
            Unlock Full Version
          </NextLink>
        </Button>
      ) : (
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {user.email}
          </MenuButton>

          <MenuList>
            <MenuItem as="button">
              <LinkOverlay
                href="https://drive.google.com/file/d/1LlSd1oCOIvlh7qJnR5p0UOr4WmP3L1Wo/view?usp=sharing"
                isExternal
              >
                Download digital version
              </LinkOverlay>
            </MenuItem>
            <MenuItem>Log out</MenuItem>
          </MenuList>
        </Menu>
      )}
    </HStack>
  );
};

export default AccountMenu;
