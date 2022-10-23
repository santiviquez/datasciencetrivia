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
  Link,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import useSWR from "swr";
import NextLink from "next/link";

import { supabase } from "../utils/supabaseClient";
import fetcher from "./api/gumroad";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const { data } = useSWR(licenseKey, fetcher);
  const email = data?.purchase?.email;

  const handleLogin = async ({ licenseKey }) => {
    try {
      setLoading(true);
      if (data?.success) {
        // setEmail(data?.purchase?.email);
        if (email) {
          const { error } = await supabase.auth.signIn({
            email,
          });
        }
      } else {
        throw error;
      }
      if (error) throw error;
    } catch (error) {
      console.log(error.error_description || error.message);
    } finally {
      setLoading(false);
      setSuccessMessage(`Check ${email} for the login link!`);
      setLicenseKey("");
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
            Resgister
          </Heading>
          <Flex flexDirection="column" width="100%">
            <Formik
              initialValues={{
                licenseKey: "",
              }}
              onSubmit={handleLogin}
            >
              {(props) => (
                <Form>
                  {/* <Field name="email" width="100%">
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
                  </Field> */}
                  <Field name="licenseKey" width="100%">
                    {({ field, form }) => (
                      <FormControl isRequired pb={4}>
                        <FormLabel htmlFor="text">License Key</FormLabel>
                        <Input
                          {...field}
                          type="text"
                          id="licenseKey"
                          placeholder="1234ABCD-1234ABCD-1234ABCD-1234ABCD"
                          onChange={(e) => setLicenseKey(e.target.value)}
                          value={licenseKey.value}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    type="submit"
                    width="100%"
                    disabled={loading || !email}
                    backgroundColor="#F6A0D1"
                    fontWeight="bold"
                    borderColor="black"
                    _hover={{ bg: "#F6B6DB" }}
                    _active={{
                      bg: "#F6ABD6",
                      transform: "scale(0.95)",
                    }}
                  >
                    <span>{loading ? "Loading" : "Activate License"}</span>
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
          <Flex>
            <Text>
              Find your license key in your email receipt. No license? Get yours{" "}
              <NextLink href="/#demo" passHref>
                <Link textDecor={"underline"}>here</Link>
              </NextLink>
              .
            </Text>
          </Flex>
        </VStack>
      </Container>
    </Flex>
  );
}
