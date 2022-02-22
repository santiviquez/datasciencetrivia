import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const AccountMenu = () => {
  return (
    <Flex flexDirection="row" justifyContent="end">
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Account
        </MenuButton>
        <MenuList>
          <MenuItem>Download digital version</MenuItem>
          <MenuItem>Log out</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default AccountMenu;
