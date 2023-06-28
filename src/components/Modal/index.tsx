"use client";

import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
};

export function Modal({ isOpen, onClose, isEditing }: ModalProps) {
  return (
    <ChakraModal onClose={onClose} isOpen={isOpen} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? "true" : "Novo Prato"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{isEditing ? "true" : "false"}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
