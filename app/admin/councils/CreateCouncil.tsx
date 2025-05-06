import FileUpload from "&/admin/FileUpload";
import {
  Box,
  Button,
  Code,
  Fieldset,
  Group,
  Modal,
  Text,
  TextInput,
} from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import React, { FC } from "react";
import { createCouncil } from "./actions/councils";
import { modals } from "@mantine/modals";

interface CreateCouncilFormProps {
  opened: boolean;
  onClose: () => void;
}

const CreateCouncilForm: FC<CreateCouncilFormProps> = ({ opened, onClose }) => {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      username: "",
      subdomain: "",
      school: "",
      logoId: undefined as string | undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: createCouncil,
    onSuccess: (data) => {
      if (data.errors) {
        form.setErrors(data.errors);
      } else {
        form.reset();
        onClose();

        modals.open({
          title: "Úspěšně vytvořeno",
          children: (
            <Box>
              <Text mb={8}>Studentská rada byla úspěšně vytvořena.</Text>
              <Text>
                Přihlašovací údaje pro administrátora:
                <br />
                E-mail: {data.user?.email}
                <br />
                Heslo: <Code>{data.user?.password}</Code>
              </Text>
            </Box>
          ),
        });
      }
    },
  });

  return (
    <Modal
      size="xl"
      onClose={onClose}
      opened={opened}
      title="Nová studentská rada"
    >
      <Form form={form} onSubmit={(data) => createMutation.mutate(data)}>
        <TextInput
          label="Název"
          placeholder="Název organizace"
          required
          mb={8}
          {...form.getInputProps("name")}
        />

        <FileUpload
          onUploadComplete={(fileIds) => {
            form.setFieldValue("logoId", fileIds[0]);
          }}
          accept={["image/png", "image/jpeg"]}
          error={form.errors.logoId}
          label="Logo"
          mb={8}
          mih={200}
        />

        <TextInput
          label="Subdoména"
          placeholder="Subdoména webu"
          mb={8}
          required
          {...form.getInputProps("subdomain")}
        />
        <TextInput
          label="Škola"
          placeholder="Název Školy"
          mb={16}
          required
          {...form.getInputProps("school")}
        />

        <Fieldset mb={16} legend="Účet administrátora">
          <TextInput
            label="Uživatelské jméno"
            placeholder="Uživatelské jméno administrátora"
            required
            mb={8}
            {...form.getInputProps("username")}
          />

          <TextInput
            label="E-mail"
            placeholder="E-mail administrátora"
            required
            {...form.getInputProps("email")}
          />
        </Fieldset>

        <Group grow>
          <Button onClick={onClose} variant="light" color="gray">
            Zavřít
          </Button>
          <Button
            type="submit"
            variant="light"
            loading={createMutation.isPending}
          >
            Vytvořit
          </Button>
        </Group>
      </Form>
    </Modal>
  );
};

export default CreateCouncilForm;
