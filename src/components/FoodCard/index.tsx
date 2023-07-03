"use client";

import { colors } from "@/styles/colors";
import { formatPrice } from "@/util/format";
import { FiEdit3, FiTrash } from "react-icons/fi";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Text,
  Image,
  Flex,
  Switch,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { FoodProps } from "@/types/FoodTypes";
import React, { RefObject, useState } from "react";

type FoodCardProps = {
  foodProps: FoodProps;
  onModalOpen: (isEditing: boolean, foodId?: string) => void;
  onDelete: (foodId: string) => void;
  onChangeAvailable: (foodId: string) => void;
};

export function FoodCard({
  onModalOpen,
  foodProps,
  onDelete,
  onChangeAvailable,
}: FoodCardProps) {
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const cancelRef = React.useRef();

  return (
    <Card maxW="sm" borderRadius="8px">
      <Image
        src={foodProps?.image}
        alt="Green double couch with wooden legs"
        h="198px"
        objectFit="cover"
        w="100%"
        borderRadius="8px 8px 0px 0px"
      />
      <CardBody margin="0" bg="#F0F0F5" paddingX="30px">
        <Stack spacing="16px">
          <Heading size="md">{foodProps.name}</Heading>
          <Text>{foodProps.description}</Text>
          <Text color={colors.darkGreen} fontSize="2xl" fontWeight="bold">
            {formatPrice(foodProps.price ?? 0)}
          </Text>
        </Stack>
      </CardBody>
      <CardFooter bg="#E4E4EB" borderRadius="0px 0px 8px 8px" paddingX="30px">
        <Flex align="center" justify="space-between" w="100%">
          <Flex gap="6px">
            <Button
              padding="10px"
              bg="white"
              onClick={() => onModalOpen(true, foodProps.id)}
            >
              <FiEdit3 />
            </Button>
            <Button padding="10px" bg="white" onClick={() => onDeleteOpen()}>
              <FiTrash />
            </Button>
          </Flex>

          <Flex fontSize="16px" fontWeight="400" align="center" gap="12px">
            <Text>Disponível</Text>
            <Switch
              size="lg"
              colorScheme="green"
              onChange={() => onChangeAvailable(foodProps.id)}
              isChecked={foodProps.available}
            />
          </Flex>
        </Flex>
      </CardFooter>

      <AlertDialog
        motionPreset="scale"
        onClose={onDeleteClose}
        leastDestructiveRef={cancelRef as unknown as RefObject<HTMLElement>}
        isOpen={isDeleteOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Deletar prato?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Você tem certeza que deseja deletar este prato?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onDeleteClose}>Não</Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => onDelete(foodProps?.id)}
            >
              Sim
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
