import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { RootStyleRegistry } from "./EmotionRootStyleRegistry";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import QueryClientProvider from "./providers/QueryClientProvider";

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
  description: "Jsme portál pro studentské rady a školní parlamenty, který pomáhá studentům a školám navázat spolupráci.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootStyleRegistry>
          <MantineEmotionProvider>
            <MantineProvider stylesTransform={emotionTransform}>
              <QueryClientProvider>
                {children}
              </QueryClientProvider>
            </MantineProvider>
          </MantineEmotionProvider>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
