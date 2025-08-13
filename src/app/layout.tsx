import type { Metadata } from "next";
import { Geist, PT_Serif, Oswald, Handlee, Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/context/QueryProvider";

const geistSans = Geist({
  weight: ["400", "700"],
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  weight: ["400", "700"],
  style: "normal",
  variable: "--font-pt-serif",
  subsets: ["latin"],
});

const oswald = Oswald({
  weight: ["400", "700"],
  variable: "--font-oswald",
  subsets: ["latin"],
});

const handlee = Handlee({
  weight: "400",
  variable: "--font-handlee",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiebymin AI",
  description: "Website fashion ditenagai dengan AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${ptSerif.variable} ${oswald.variable} ${handlee.variable} ${poppins.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
