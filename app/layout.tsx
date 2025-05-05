import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { RootStyleRegistry } from "./EmotionRootStyleRegistry";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import QueryClientProvider from "./providers/QueryClientProvider";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import UserProvider from "./providers/UserProvider";
import { getAuth } from "./lib/auth/dal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studentské Rady ČR",
  description:
    "Jsme portál pro studentské rady a školní parlamenty, který pomáhá studentům a školám navázat spolupráci.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getAuth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider>
          <UserProvider defaultUser={user}>
            <RootStyleRegistry>
              <MantineEmotionProvider>
                <MantineProvider stylesTransform={emotionTransform}>
                  {children}
                </MantineProvider>
              </MantineEmotionProvider>
            </RootStyleRegistry>
          </UserProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
