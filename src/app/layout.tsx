import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <title>BaseMiner</title>
        <meta
          name="description"
          content="A Base mining mini app where every mine creates a collectible with no financial value."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1f392f" />
        <meta name="base:app_id" content="69bcadaa945e0bb74a271fa8" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
