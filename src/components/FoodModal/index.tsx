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
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { ImageUploader } from "../ImageUploader";
import { set, useForm } from "react-hook-form";
import { colors } from "@/styles/colors";
import { FoodProps } from "@/types/FoodTypes";
import { formatPrice } from "@/util/format";
import { unformatPrice } from "@/util/unformat";
import { FileTypes } from "@/types/FileTypes";

type ModalProps = {
  isOpen: boolean;
  isEditing: boolean;
  foodProps?: FoodProps;

  onClose: () => void;
  onAddFood: (food: FoodProps) => void;
  onEditFood: (food: FoodProps) => void;
};

type FormValues = {
  file_: FileList;
};

export function FoodModal({
  isOpen,
  onClose,
  isEditing,
  foodProps,
  onAddFood,
  onEditFood,
}: ModalProps) {
  const {
    register,
    formState: { errors },
  } = useForm<FormValues>();

  const validateFiles = (value: FileList) => {
    if (value.length < 1) {
      return "Files is required";
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024);
      const MAX_FILE_SIZE = 10;
      if (fsMb > MAX_FILE_SIZE) {
        return "Max file size 10mb";
      }
    }
    return true;
  };

  const [files, setFiles] = useState<FileTypes>();
  const [foodName, setFoodName] = useState<string>("");
  const [foodPrice, setFoodPrice] = useState<number>(0);
  const [foodDescription, setFoodDescription] = useState<string>("");

  function clearData() {
    setFoodName("");
    setFoodPrice(0);
    setFoodDescription("");
  }

  function generateGUID() {
    let dt = new Date().getTime();
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  function onSubmit() {
    const food = {
      id: foodProps?.id ?? generateGUID(),
      name: foodName,
      price: foodPrice,
      description: foodDescription,
      image: files?.base64 ?? foodProps?.image,
      available: true,
    } as FoodProps;

    if (isEditing) {
      onEditFood(food);
    } else {
      onAddFood(food);
    }

    clearData();
    onClose();
  }

  useMemo(() => {
    clearData();
    if (foodProps) {
      setFoodName(foodProps?.name);
      setFoodPrice(foodProps?.price);
      setFoodDescription(foodProps?.description);
      setFiles({ base64: foodProps?.image, name: foodProps?.id });
    }
  }, [foodProps]);

  return (
    <ChakraModal onClose={onClose} isOpen={isOpen} isCentered size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? `Editar prato ${foodProps?.name}` : "Novo Prato"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isEditing ? (
            <ImageUploader
              accept={"image/*"}
              register={register("file_", { validate: validateFiles })}
              setFile={(file) => setFiles(file)}
              file={files?.base64}
            />
          ) : (
            <ImageUploader
              accept={"image/*"}
              register={register("file_", { validate: validateFiles })}
              setFile={(file) => setFiles(file)}
            />
          )}

          <Flex mt="1rem" gap="1rem">
            <FormControl w="70%">
              <FormLabel>Nome do prato</FormLabel>
              <Input
                type="text"
                placeholder="Ex: Moda Italiana"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
            </FormControl>
            <FormControl w="30%">
              <FormLabel>Preço</FormLabel>
              <Input
                type="text"
                placeholder="R$ "
                value={formatPrice(foodPrice)}
                onChange={(e) => setFoodPrice(unformatPrice(e.target.value))}
              />
            </FormControl>
          </Flex>

          <FormControl mt="1rem">
            <FormLabel>Descrição do prato</FormLabel>
            <Textarea
              minLength={5}
              value={foodDescription}
              onChange={(e) => setFoodDescription(e.target.value)}
              placeholder="Ex: Macarrão ao dente ao molho bolognese"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            bg={colors.darkGreen}
            color="white"
            colorScheme="none"
            onClick={onSubmit}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
