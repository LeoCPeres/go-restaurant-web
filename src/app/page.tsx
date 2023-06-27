"use client";

import { FoodCard } from "@/components/FoodCard";
import { Navbar } from "@/components/Navbar";
import { colors } from "@/styles/colors";
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex direction="column" w="100%" h="100%">
      <Navbar />

      <Box w="100%" bg={colors.primary} h="154px" />

      <SimpleGrid
        columns={3}
        spacing="32px"
        paddingX="160px"
        marginTop="-100px"
        minChildWidth={"352px"}
        marginBottom="3rem"
      >
        <FoodCard />
        <FoodCard />
        <FoodCard />
        <FoodCard />
        <FoodCard />
      </SimpleGrid>
    </Flex>
  );
}
