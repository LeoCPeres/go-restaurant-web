import { colors } from "@/styles/colors";
import { IngredientProps } from "@/types/IngredientTypes";
import { formatPrice } from "@/util/format";
import { generateGUID } from "@/util/genUID";
import { unformatPrice } from "@/util/unformat";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { RefObject, useState } from "react";
import { FiEdit3, FiTrash } from "react-icons/fi";

type IngredientTableProps = {
  ingredients: IngredientProps[];
  setIngredients: (ingredients: IngredientProps[]) => void;
};

export function IngredientsTable({
  ingredients,
  setIngredients,
}: IngredientTableProps) {
  const {
    isOpen: isIngredientOpen,
    onOpen: onIngredientOpen,
    onClose: onIngredientClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteIngredientOpen,
    onOpen: onDeleteIngredientOpen,
    onClose: onDeleteIngredientClose,
  } = useDisclosure();
  const cancelRef = React.useRef();

  const [ingredientName, setIngredientName] = useState<string>("");
  const [ingredientPrice, setIngredientPrice] = useState<number>(0);
  const [isEditingIngredient, setIsEditingIngredient] =
    useState<boolean>(false);
  const [ingredientEditingId, setIngredientEditingId] = useState<string>("");

  function handleAddIngredient() {
    const ingredient = {
      id: generateGUID(),
      name: ingredientName,
      price: ingredientPrice,
    } as IngredientProps;

    setIngredients([...ingredients, ingredient]);
    setIngredientName("");
    setIngredientPrice(0);
    onIngredientClose();
  }

  function handleEditIngredient(ingredientId: string) {
    const ingredient = ingredients.find((i) => i.id === ingredientId);
    setIngredientName(ingredient?.name ?? "");
    setIngredientPrice(ingredient?.price ?? 0);
    setIsEditingIngredient(true);
    setIngredientEditingId(ingredientId);
    onIngredientOpen();
  }

  function handleDeleteIngredient() {
    const ingredient = ingredients.filter((i) => i.id !== ingredientEditingId);
    setIngredients(ingredient);
    onDeleteIngredientClose();
  }

  function handleSaveIngredientEditing() {
    const ingredient = ingredients.map((i) => {
      if (i.id === ingredientEditingId) {
        return {
          ...i,
          name: ingredientName,
          price: ingredientPrice,
        };
      }
      return i;
    });

    setIngredients(ingredient);
    setIngredientName("");
    setIngredientPrice(0);
    setIsEditingIngredient(false);
    onIngredientClose();
  }

  function handleCloseIngredient() {
    setIngredientName("");
    setIngredientPrice(0);
    setIsEditingIngredient(false);
    onIngredientClose();
  }

  return (
    <>
      <Flex direction="column" gap="0.5rem">
        <Flex justify="space-between" align="center" mt="1rem">
          <Text fontWeight="semibold">Ingredientes</Text>

          <Button
            bg="transparent"
            colorScheme="none"
            color={colors.primary}
            onClick={onIngredientOpen}
          >
            Novo +
          </Button>
        </Flex>
        <Divider />

        <TableContainer
          display={ingredients.length > 0 ? "" : "none"}
          __css={{ transition: "display 0.2s" }}
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th textAlign="center">Ingrediente</Th>
                <Th w="100%" textAlign="center">
                  Valor
                </Th>
                <Th textAlign="center">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ingredients?.map((ingredient) => {
                return (
                  <Tr key={ingredient.id}>
                    <Td>{ingredient.name}</Td>
                    <Td textAlign="center">{formatPrice(ingredient.price)}</Td>
                    <Td>
                      <Flex gap="12px">
                        <Tooltip label="Editar">
                          <Button
                            fontSize="18px"
                            bg="transparent"
                            colorScheme="none"
                            color="black"
                            __css={{ transition: "0.2s" }}
                            onClick={() => handleEditIngredient(ingredient.id)}
                          >
                            <FiEdit3 />
                          </Button>
                        </Tooltip>
                        <Tooltip label="Apagar">
                          <Button
                            bg="transparent"
                            colorScheme="none"
                            color={colors.primary}
                            fontSize="18px"
                            __css={{ transition: "0.2s" }}
                            onClick={() => {
                              setIngredientEditingId(ingredient.id);
                              onDeleteIngredientOpen();
                            }}
                          >
                            <FiTrash />
                          </Button>
                        </Tooltip>
                      </Flex>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>

      <Modal
        onClose={handleCloseIngredient}
        isOpen={isIngredientOpen}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditingIngredient ? "Editando ingrediente" : "Novo ingrediente"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap="0.5rem">
              <FormControl w="70%">
                <FormLabel>Nome do ingrediente</FormLabel>
                <Input
                  type="text"
                  placeholder="Ex: Tomate"
                  value={ingredientName}
                  onChange={(e) => setIngredientName(e.target.value)}
                />
              </FormControl>
              <FormControl w="30%">
                <FormLabel>Valor</FormLabel>
                <Input
                  type="text"
                  placeholder="R$ "
                  value={formatPrice(ingredientPrice)}
                  onChange={(e) =>
                    setIngredientPrice(unformatPrice(e.target.value))
                  }
                />
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            {isEditingIngredient ? (
              <Button
                bg={colors.darkGreen}
                color="white"
                colorScheme="none"
                onClick={handleSaveIngredientEditing}
              >
                Salvar alterações
              </Button>
            ) : (
              <Button
                bg={colors.darkGreen}
                color="white"
                colorScheme="none"
                onClick={handleAddIngredient}
              >
                Salvar
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        motionPreset="scale"
        leastDestructiveRef={cancelRef as unknown as RefObject<HTMLElement>}
        onClose={onDeleteIngredientClose}
        isOpen={isDeleteIngredientOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Apagar ingrediente?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Você tem certeza que deseja apagar este ingrediente?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onDeleteIngredientClose}>Não</Button>
            <Button colorScheme="red" ml={3} onClick={handleDeleteIngredient}>
              Sim, quero apagar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
