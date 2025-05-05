"use client";
import { Anchor, Button, Flex, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { loginUser } from "../actions/auth";

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

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Stack mt={32} align="center">
      <Image src="/logo.svg" alt="Logo" width={300} height={50} style={{ maxWidth: "calc(100vw - 2rem)", marginBottom: 16 }} />

      <Form form={loginForm} onSubmit={(values) => loginMutation.mutate(values)}>
        <Flex direction={"column"} w={500} maw="calc(100vw - 2rem)">
          <Paper withBorder p={16}>
            <Title mb={16} sx={{ textAlign: "center" }}>
              Login
            </Title>

            <Stack>
              <TextInput name="email" required {...loginForm.getInputProps("email")} label="Email" placeholder="Your email" />
              <TextInput
                name="password"
                required
                label="Password"
                placeholder="Your password"
                type="password"
                {...loginForm.getInputProps("password")}
              />
              <Button type="submit" loading={loginMutation.isPending}>
                Login
              </Button>
            </Stack>
          </Paper>
        </Flex>

        <Text ta="center" mt={16}>
          Don't have an account?{" "}
          <Anchor component={Link} href="/signup" variant="link">
            Sign up
          </Anchor>
        </Text>
      </Form>
    </Stack>
  );
};

export default LoginPage;
