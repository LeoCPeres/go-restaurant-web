"use client";

import { useMemo, useState } from "react";

import notFoundAnimation from "@/animations/not-found.json";
import loadingAnimation from "@/animations/loader.json";

import { FoodCard } from "@/components/FoodCard";
import { FoodModal } from "@/components/FoodModal";
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
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { dbFirebase } from "@/services/firebase";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const {
    isOpen: isFoodModalOpen,
    onOpen: onFoodModalOpen,
    onClose: onFoodModalClose,
  } = useDisclosure();
  const {
    isOpen: isCategoryModalOpen,
    onOpen: onCategoryModalOpen,
    onClose: onCategoryModalClose,
  } = useDisclosure();

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

  function handleOpenFoodModal(isEditing: boolean, foodId?: string) {
    setIsEditing(isEditing);

    if (isEditing) {
      const food = foodList.find((food) => food.id === foodId);
      setFoodEditing(food);
    } else {
      setFoodEditing(undefined);
    }

    onFoodModalOpen();
  }

  function handleOpenCategoryModal(isEditing: boolean, categoryId?: string) {
    setIsEditing(isEditing);

    if (isEditing) {
      const food = foodList.find((category) => category.id === categoryId);
      setFoodEditing(food);
    } else {
      setFoodEditing(undefined);
    }

    onCategoryModalOpen();
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
            onClick={() => handleOpenFoodModal(false)}
          >
            Cadastrar novo prato
          </Button>
        </Flex>
      );
    }

    return foodList?.map((food) => (
      <FoodCard
        key={food.id}
        onModalOpen={(isEditing, foodId) =>
          handleOpenFoodModal(isEditing, foodId)
        }
        foodProps={food}
        onDelete={(foodId) => handleDeleteFood(foodId)}
        onChangeAvailable={(foodId, available) =>
          handleChangeAvailability(foodId, available)
        }
      />
    ));
  }

  function handleAddFood(food: FoodProps) {
    setFoodList([...foodList, food]);
  }

  async function handleDeleteFood(foodId: string) {
    await deleteDoc(doc(dbFirebase, "foods", foodId));
  }

  async function handleChangeAvailability(foodId: string, available: boolean) {
    const foodDocRef = doc(dbFirebase, "foods", foodId);
    await updateDoc(foodDocRef, {
      available: !available,
    });
  }

  useMemo(() => {
    const unsubscribe = onSnapshot(collection(dbFirebase, "foods"), (snap) => {
      setIsLoading(true);
      const docs = snap.docs.map((doc) => doc.data() as FoodProps);

      setFoodList(docs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Flex direction="column" w="100%" h="100%">
      <Toaster />
      <Navbar onFoodModalOpen={(e) => handleOpenFoodModal(e)} />

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
        <FoodModal
          isOpen={isFoodModalOpen}
          onClose={onFoodModalClose}
          isEditing={isEditing}
          foodProps={foodEditing}
          onAddFood={(food) => handleAddFood(food)}
        />
      </SimpleGrid>
    </Flex>
  );
}
