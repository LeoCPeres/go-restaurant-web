"use client";

import { useMemo, useState } from "react";

import notFoundAnimation from "@/animations/not-found.json";
import loadingAnimation from "@/animations/loader.json";

import { FoodCard } from "@/components/FoodCard";
import { Modal } from "@/components/Modal";
import { Navbar } from "@/components/Navbar";
import { colors } from "@/styles/colors";
import { FoodProps } from "@/types/FoodTypes";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Lottie from "react-lottie";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [foodEditing, setFoodEditing] = useState<FoodProps>();
  const [foodList, setFoodList] = useState<FoodProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const notFoundOptions = {
    loop: true,
    autoplay: true,
    animationData: notFoundAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  function handleOpenModal(isEditing: boolean, foodId?: string) {
    setIsEditing(isEditing);

    if (isEditing) {
      const food = foodList.find((food) => food.id === foodId);
      setFoodEditing(food);
    } else {
      setFoodEditing(undefined);
    }

    onOpen();
  }

  function renderFoodList() {
    if (foodList.length === 0 && isLoading === true) {
      return (
        <Flex
          mt="150px"
          w="100%"
          h="100%"
          alignItems="center"
          justifyContent="center"
          direction="column"
          gap="1rem"
        >
          <Lottie
            options={loadingOptions}
            width={250}
            height={150}
            style={{ padding: 0, margin: 0 }}
          />
        </Flex>
      );
    }

    if (foodList.length === 0 && isLoading === false) {
      return (
        <Flex
          mt="150px"
          w="100%"
          h="100%"
          alignItems="center"
          justifyContent="center"
          direction="column"
          gap="1rem"
        >
          <Lottie
            options={notFoundOptions}
            width={250}
            height={150}
            style={{ padding: 0, margin: 0 }}
          />
          <Text align="center" fontWeight="semibold" fontSize="22px" mt="-10px">
            Ops! Parece que ainda não temos <br />
            nenhum prato cadastrado!
          </Text>
          <Button
            bg={colors.lightGreen}
            color="white"
            colorScheme="none"
            mt="1rem"
            onClick={() => handleOpenModal(false)}
          >
            Cadastrar novo prato
          </Button>
        </Flex>
      );
    }

    return foodList?.map((food) => (
      <FoodCard
        key={food.id}
        onModalOpen={(isEditing, foodId) => handleOpenModal(isEditing, foodId)}
        foodProps={food}
        onDelete={(foodId) => handleDeleteFood(foodId)}
        onChangeAvailable={(foodId) => handleChangeAvailability(foodId)}
      />
    ));
  }

  function handleAddFood(food: FoodProps) {
    setFoodList([...foodList, food]);
  }

  function handleUpdateFood(food: FoodProps) {
    const updatedFoodList = foodList.map((foodItem) => {
      if (foodItem.id === food.id) {
        return food;
      }

      return foodItem;
    });

    setFoodList(updatedFoodList);
  }

  function handleDeleteFood(foodId: string) {
    const updatedFoodList = foodList.filter((foodItem) => {
      if (foodItem.id !== foodId) {
        return foodItem;
      }
    });

    setFoodList(updatedFoodList);
  }

  function handleChangeAvailability(foodId: string) {
    const updatedFoodList = foodList.map((foodItem) => {
      if (foodItem.id === foodId) {
        return {
          ...foodItem,
          available: !foodItem.available,
        };
      }

      return foodItem;
    });

    setFoodList(updatedFoodList);
  }

  useMemo(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

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
        w="100%"
        gridTemplateColumns={
          foodList.length > 0 ? "repeat(auto-fill, minmax(352px, 1fr))" : "none"
        }
      >
        {renderFoodList()}
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          isEditing={isEditing}
          foodProps={foodEditing}
          onAddFood={(food) => handleAddFood(food)}
          onEditFood={(food) => handleUpdateFood(food)}
        />
      </SimpleGrid>
    </Flex>
  );
}
