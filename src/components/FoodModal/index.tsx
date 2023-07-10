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
  Text,
  Divider,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tfoot,
  Td,
  Tbody,
  useDisclosure,
  Tooltip,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, { useMemo, useState, RefObject } from "react";
import { ImageUploader } from "../ImageUploader";
import { useForm } from "react-hook-form";
import { colors } from "@/styles/colors";
import { FoodProps } from "@/types/FoodTypes";
import { formatPrice } from "@/util/format";
import { unformatPrice } from "@/util/unformat";
import { FileTypes } from "@/types/FileTypes";
import { IngredientProps } from "@/types/IngredientTypes";
import { FiChevronDown, FiEdit3, FiTrash } from "react-icons/fi";
import { generateGUID } from "@/util/genUID";
import { IngredientsTable } from "../IngredientsTable";

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
  const [foodCategory, setFoodCategory] = useState<string>("");

  const [ingredients, setIngredients] = useState<IngredientProps[]>([]);

  function clearData() {
    setFoodName("");
    setFoodPrice(0);
    setFoodDescription("");
    setIngredients([]);
  }

  function onSubmit() {
    const food = {
      id: foodProps?.id ?? generateGUID(),
      name: foodName,
      price: foodPrice,
      description: foodDescription,
      image: files?.base64 ?? foodProps?.image,
      available: true,
      ingredientsList: ingredients,
      foodCategory: foodCategory,
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
      setIngredients(foodProps?.ingredientsList ?? []);
      setFoodCategory(foodProps?.foodCategory ?? "");
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
            <FormControl w="100%">
              <FormLabel>Nome do prato</FormLabel>
              <Input
                type="text"
                placeholder="Ex: Moda Italiana"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
            </FormControl>
            <FormControl w="25%">
              <FormLabel>Preço</FormLabel>
              <Input
                type="text"
                placeholder="R$ "
                value={formatPrice(foodPrice)}
                onChange={(e) => setFoodPrice(unformatPrice(e.target.value))}
              />
            </FormControl>
            <FormControl w="20%">
              <FormLabel>Categoria</FormLabel>
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                  {foodCategory ? foodCategory : "Selecione"}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setFoodCategory("Massas")}>
                    Massas
                  </MenuItem>
                  <MenuItem onClick={() => setFoodCategory("Pizzas")}>
                    Pizzas
                  </MenuItem>
                  <MenuItem onClick={() => setFoodCategory("Carnes")}>
                    Carnes
                  </MenuItem>
                  <MenuItem onClick={() => setFoodCategory("Caldos")}>
                    Caldos
                  </MenuItem>
                  <MenuItem onClick={() => setFoodCategory("Porções")}>
                    Porções
                  </MenuItem>
                </MenuList>
              </Menu>
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

          <IngredientsTable
            ingredients={ingredients}
            setIngredients={(e) => setIngredients(e)}
          />
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
