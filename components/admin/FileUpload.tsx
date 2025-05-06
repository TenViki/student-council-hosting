import {
  Box,
  Flex,
  Group,
  Image,
  Loader,
  Progress,
  rem,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import axios from "axios";
import { FC, ReactNode, useState } from "react";
import { Check, LucideFile, LucideImage, Upload, LucideX } from "lucide-react";

interface FileDropProps {
  onUploadComplete: (fileIds: string[]) => void;
  accept?: DropzoneProps["accept"];
  error?: string | ReactNode;
  mb?: number;
  label?: string;
  mih?: number;
  hideUploadedFile?: boolean;
}

const FileUpload: FC<FileDropProps & Partial<DropzoneProps>> = ({
  onUploadComplete,
  accept,
  error,
  mb,
  label,
  mih = 220,
  hideUploadedFile,
  ...props
}) => {
  const FileIcon = accept === IMAGE_MIME_TYPE ? LucideImage : LucideFile;
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resError, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleUpload = async (files: File[]) => {
    console.log(files);
    setFile(files[0]);
    setFiles(files);

    setError(null);

    const formData = new FormData();

    for (const file of files) {
      console.log("Adding file to form data", file);
      formData.append("files[]", file);
    }

    try {
      setPending(true);
      const response = await axios.post("/api/files", formData, {
        onUploadProgress: (progressEvent) => {
          setUploadProgress(
            Math.round((progressEvent.loaded / progressEvent.total!) * 100)
          );
        },
        withCredentials: true,
      });

      setPending(false);
      onUploadComplete(response.data.fileIds as string[]);
    } catch (error) {
      setError("Failed to upload file");
      console.error(error);
    }
  };

  return (
    <Box mb={mb}>
      {label && (
        <Text size="sm" fw={500}>
          {label}
        </Text>
      )}
      <Dropzone
        onDrop={handleUpload}
        onReject={(files) => console.log("rejected files", files)}
        accept={accept}
        mb={error ? 4 : 0}
        sx={
          error
            ? {
                borderColor: "var(--mantine-color-red-9)",
                borderStyle: "solid",
              }
            : {}
        }
        {...props}
      >
        {!file ? (
          <Group
            justify="center"
            gap="xl"
            mih={mih}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <Upload
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-blue-6)",
                }}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <LucideX
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-red-6)",
                }}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <FileIcon
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-dimmed)",
                }}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Přetáhněte soubory sem nebo{" "}
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Klikněte pro výběr
              </Text>
            </div>
          </Group>
        ) : (
          <>
            <Text mb={8} c="dimmed" size="sm">
              {file?.name}{" "}
              {files.length > 1 && (
                <>
                  a {files.length - 1}{" "}
                  {files.length - 1 >= 5 ? "dalších" : "další"}
                </>
              )}
            </Text>
            {!hideUploadedFile && (
              <Flex justify="center">
                <Image
                  mah={350}
                  radius="md"
                  src={URL.createObjectURL(file)}
                  mb={8}
                />
              </Flex>
            )}
            {uploadProgress !== 100 ? (
              <Progress
                transitionDuration={200}
                striped
                animated
                value={uploadProgress}
              />
            ) : (
              <Group gap={8}>
                {resError ? (
                  <>
                    <ThemeIcon
                      size="sm"
                      radius="xl"
                      variant="filled"
                      color="red"
                    >
                      <LucideX />
                    </ThemeIcon>

                    <Text size="sm">{resError}</Text>
                  </>
                ) : pending ? (
                  <>
                    <Loader size="sm" />

                    <Text size="sm">Nahrávání...</Text>
                  </>
                ) : (
                  <>
                    <ThemeIcon
                      size="sm"
                      radius="xl"
                      variant="filled"
                      color="green"
                    >
                      <Check size={"1rem"} />
                    </ThemeIcon>

                    <Text size="sm">Soubor byl úspěšně nahrán!</Text>
                  </>
                )}
              </Group>
            )}
          </>
        )}
      </Dropzone>

      {error && (
        <Text size="xs" c="var(--mantine-color-red-8)">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default FileUpload;
