"use client";

import { colors } from "@/styles/colors";
import { Image } from "@chakra-ui/next-js";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

export function Navbar() {
  return (
    <Flex
      justify="space-between"
      align="center"
      bg={colors.primary}
      paddingY="40px"
      paddingX="160px"
    >
      <Image
        src="/images/logo-go-restaurant.svg"
        alt="logo-go-restaurant"
        width={308}
        height={62}
      />
      <Button
        bg={colors.darkGreen}
        color="white"
        colorScheme="none"
        transition={"filter 0.2s"}
        _hover={{ filter: "brightness(0.9)" }}
      >
        <Text paddingY="16px" paddingX="24px" fontSize="16px">
          Novo prato
        </Text>
        <Image src="/icons/plus.svg" alt="plus" width={8} height={8} />
      </Button>
    </Flex>
  );
}
