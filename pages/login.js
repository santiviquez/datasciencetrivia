import React, { useState } from "react";
import {
  Button,
  Flex,
  Input,
  VStack,
  Container,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { supabase } from "../utils/supabaseClient";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const handleLogin = async ({ email }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn(
        { email },
        { shouldCreateUser: false }
      );
      if (error) {
        throw error;
      } else {
        setSuccessMessage("Check your email for the login link!");
      }
    } catch (error) {
      console.log(error.error_description || error.message);
      setSuccessMessage("There is no account with that email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      direction="column"
      borderWidth={["10px", "15px", "15px", "15px"]}
      borderTopColor="#72D0EA"
      borderLeftColor="#91DBCE"
      borderRightColor="#EFAAAD"
      borderBottomColor="#BB92D4"
      width="100%"
      height="100vh"
      p={6}
      alignContent="center"
      justifyContent="center"
    >
      <Container
        borderRadius="10"
        border="1px"
        borderColor="gray.200"
        p={8}
        width="400px"
      >
        <VStack spacing="16px">
          <Heading alignSelf="self-start" pb={4}>
            Login
          </Heading>
          <Flex flexDirection="column" width="100%">
            <Formik
              initialValues={{
                email: "",
              }}
              onSubmit={handleLogin}
            >
              {(props) => (
                <Form>
                  <Field name="email" width="100%">
                    {({ field, form }) => (
                      <FormControl isRequired pb={4}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          {...field}
                          type="email"
                          id="email"
                          placeholder="you@awesome.com"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    type="submit"
                    width="100%"
                    disabled={loading}
                    backgroundColor="#F6A0D1"
                    fontWeight="bold"
                    borderColor="black"
                    _hover={{ bg: "#F6B6DB" }}
                    _active={{
                      bg: "#F6ABD6",
                      transform: "scale(0.95)",
                    }}
                  >
                    <span>{loading ? "Loading" : "Send magic link"}</span>
                  </Button>
                </Form>
              )}
            </Formik>
          </Flex>
          <Text
            justifySelf="center"
            fontWeight="medium"
            color="GrayText"
            fontSize="sm"
          >
            {successMessage}
          </Text>
        </VStack>
      </Container>
    </Flex>
  );
}
