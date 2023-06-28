"use client";

import { FoodCard } from "@/components/FoodCard";
import { Modal } from "@/components/Modal";
import { Navbar } from "@/components/Navbar";
import { colors } from "@/styles/colors";
import { Box, Flex, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);

  function handleOpenModal(isEditing: boolean) {
    setIsEditing(isEditing);
    onOpen();
  }

  return (
    <Flex direction="column" w="100%" h="100%">
      <Navbar onModalOpen={(e) => handleOpenModal(e)} />

      <Box w="100%" bg={colors.primary} h="154px" />

      <SimpleGrid
        columns={3}
        spacing="32px"
        paddingX="160px"
        marginTop="-100px"
        minChildWidth={"352px"}
        marginBottom="3rem"
      >
        <FoodCard onModalOpen={(e) => handleOpenModal(e)} />
        <FoodCard onModalOpen={(e) => handleOpenModal(e)} />
        <FoodCard onModalOpen={(e) => handleOpenModal(e)} />
        <FoodCard onModalOpen={(e) => handleOpenModal(e)} />
        <FoodCard onModalOpen={(e) => handleOpenModal(e)} />

        <Modal isOpen={isOpen} onClose={onClose} isEditing={isEditing} />
      </SimpleGrid>
    </Flex>
  );
}
