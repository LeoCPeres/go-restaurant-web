"use client";

import { colors } from "@/styles/colors";
import { Image } from "@chakra-ui/next-js";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

type NavbarProps = {
  onModalOpen: (isEditing: boolean) => void;
};

export function Navbar({ onModalOpen }: NavbarProps) {
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
        paddingY="16px"
        paddingX="24px"
        gap="8px"
        textAlign="center"
        onClick={() => onModalOpen(false)}
      >
        <Text fontSize="16px">Novo Prato</Text>
        <Image src="/icons/plus.svg" alt="plus" width={6} height={6} />
      </Button>
    </Flex>
  );
}
