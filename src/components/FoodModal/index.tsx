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
  Textarea,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { ImageUploader } from "../ImageUploader";
import { useForm } from "react-hook-form";
import { colors } from "@/styles/colors";
import { FoodProps } from "@/types/FoodTypes";
import { formatPrice } from "@/util/format";
import { unformatPrice } from "@/util/unformat";
import { FileTypes } from "@/types/FileTypes";
import { IngredientProps } from "@/types/IngredientTypes";
import { FiChevronDown } from "react-icons/fi";
import { generateGUID } from "@/util/genUID";
import { IngredientsTable } from "../IngredientsTable";
import toast, { Toaster } from "react-hot-toast";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { dbFirebase } from "@/services/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";

type ModalProps = {
  isOpen: boolean;
  isEditing: boolean;
  foodProps?: FoodProps;

  onClose: () => void;
  onAddFood: (food: FoodProps) => void;
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

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setFoodCategory("");
  }

  async function onSubmit() {
    if (foodCategory == "") return toast.error("Selecione uma categoria");
    if (!files) return toast.error("Selecione uma imagem");
    if (foodName == "") return toast.error("Digite um nome");
    if (foodPrice == 0) return toast.error("Digite um preço");
    if (foodDescription == "") return toast.error("Digite uma descrição");
    setIsLoading(true);

    const storage = getStorage();
    const foodImageRef = ref(storage, files.name);
    let imageUrl = null;

    console.log(files.base64);

    if (isEditing && files.base64) {
      const uploadTask = uploadString(foodImageRef, files.base64, "data_url");

      await getDownloadURL((await uploadTask).ref).then((url) => {
        imageUrl = url;
      });
    }

    if (!isEditing) {
      const uploadTask = uploadString(foodImageRef, files.base64, "data_url");

      await getDownloadURL((await uploadTask).ref).then((url) => {
        imageUrl = url;
      });
    }

    const food = {
      id: foodProps?.id ?? generateGUID(),
      name: foodName,
      price: foodPrice,
      description: foodDescription,
      image: imageUrl != null ? imageUrl : foodProps?.image,
      available: true,
      ingredientsList: ingredients,
      foodCategory: foodCategory,
    } as FoodProps;

    if (isEditing) {
      await updateDoc(doc(dbFirebase, "foods", food.id), food);
      setIsLoading(false);
      toast.success("Prato editado com sucesso!");
      clearData();
      onClose();
      return;
    }

    await setDoc(doc(dbFirebase, "foods", food.id), food)
      .then(() => {
        toast.success("Prato cadastrado com sucesso!");
        clearData();
        onClose();
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error("Erro ao cadastrar prato!");
        console.log(error);
        setIsLoading(false);
      });
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
            isLoading={isLoading}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
