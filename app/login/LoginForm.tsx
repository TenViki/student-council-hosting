"use client";

import {
  Anchor,
  Button,
  Flex,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { loginUser } from "../actions/auth";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.errors) return loginForm.setErrors(data.errors);

      queryClient.invalidateQueries({ queryKey: ["user"] });

      notifications.show({
        title: "Welcome back!",
        message: "You have successfully logged in",
      });
    },
  });
  const queryParams = useSearchParams();
  const redirectTo = queryParams.get("to");

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
      redirectTo: redirectTo || undefined,
    },
  });

  return (
    <Stack mt={32} align="center">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={300}
        height={50}
        style={{ maxWidth: "calc(100vw - 2rem)", marginBottom: 16 }}
      />

      <Form
        form={loginForm}
        onSubmit={(values) => loginMutation.mutate(values)}
      >
        <Flex direction={"column"} w={500} maw="calc(100vw - 2rem)">
          <Paper withBorder p={16}>
            <Title mb={16} sx={{ textAlign: "center" }}>
              Přihlášení
            </Title>

            <Stack>
              <TextInput
                name="email"
                required
                {...loginForm.getInputProps("email")}
                label="Email"
                placeholder="Zdej tvůj email..."
              />
              <TextInput
                name="password"
                required
                label="Heslo"
                placeholder="Zadej tvoje heslo..."
                type="password"
                {...loginForm.getInputProps("password")}
              />
              <Button type="submit" loading={loginMutation.isPending}>
                Přihlásit se
              </Button>
            </Stack>
          </Paper>
        </Flex>

        {redirectTo && (
          <Text mt={8} c="dimmed" size="sm" ta="center">
            Po přihlášení budeš přesměrován na {redirectTo}
          </Text>
        )}

        <Text ta="center" mt={16}>
          Ještě nemáš účet?{" "}
          <Anchor component={Link} href="/contact" variant="link">
            Kontaktuj nás!
          </Anchor>
        </Text>
      </Form>
    </Stack>
  );
};

export default LoginPage;
