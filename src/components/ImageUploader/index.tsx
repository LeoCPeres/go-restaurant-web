import { colors } from "@/styles/colors";
import { FileTypes } from "@/types/FileTypes";
import { Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";

type FileUploadProps = {
  register: UseFormRegisterReturn;
  accept?: string;
  multiple?: boolean;
  file?: string;
  setFile: (base64File: FileTypes) => void;
};

export function ImageUploader(props: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState("");

  const { register, accept, multiple, setFile, file } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void;
  };

  const handleClick = () => inputRef.current?.click();

  const onSelectedFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setFile({ base64: base64Data, name: file.name } as FileTypes);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    convertToBase64(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <Flex
      bg={colors.lightGray}
      w="100%"
      align="center"
      justify="center"
      h="100%"
      minH="160px"
      mt="10px"
      borderRadius="16px"
      border={selectedFile == undefined ? "2px dashed #989ea1" : "none"}
      cursor="pointer"
      onClick={handleClick}
    >
      <input
        type="file"
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
        onChange={onSelectedFile}
      />
      {selectedFile != undefined || file != undefined ? (
        <Image
          src={file ?? preview}
          w="100%"
          h="100%"
          objectFit="cover"
          borderRadius="16px"
        />
      ) : (
        <Text color={colors.primary} fontSize="16px" fontWeight="bold">
          + Adicionar uma foto
        </Text>
      )}
    </Flex>
  );
}
