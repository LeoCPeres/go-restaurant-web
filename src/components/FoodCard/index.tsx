"use client";

import { colors } from "@/styles/colors";
import { formatPrice } from "@/util/format";
import { FiEdit3, FiTrash } from "react-icons/fi";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Text,
  Image,
  Flex,
  Switch,
} from "@chakra-ui/react";

export function FoodCard() {
  return (
    <Card maxW="sm" borderRadius="8px">
      <Image
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        alt="Green double couch with wooden legs"
        h="198px"
        objectFit="cover"
        w="100%"
        borderRadius="8px 8px 0px 0px"
      />
      <CardBody margin="0" bg="#F0F0F5" paddingX="30px">
        <Stack spacing="16px">
          <Heading size="md">Living room Sofa</Heading>
          <Text>
            This sofa is perfect for modern tropical spaces, baroque inspired
            spaces, earthy toned spaces and for people who love a chic design
            with a sprinkle of vintage design.
          </Text>
          <Text color={colors.darkGreen} fontSize="2xl" fontWeight="bold">
            {formatPrice(450)}
          </Text>
        </Stack>
      </CardBody>
      <CardFooter bg="#E4E4EB" borderRadius="0px 0px 8px 8px" paddingX="30px">
        <Flex align="center" justify="space-between" w="100%">
          <Flex gap="6px">
            <Button padding="10px" bg="white">
              <FiEdit3 />
            </Button>
            <Button padding="10px" bg="white">
              <FiTrash />
            </Button>
          </Flex>

          <Flex fontSize="16px" fontWeight="400" align="center" gap="12px">
            <Text>Disponível</Text>
            <Switch size="lg" colorScheme="green" />
          </Flex>
        </Flex>
      </CardFooter>
    </Card>
  );
}
