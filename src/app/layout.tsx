import type { Metadata } from "next";
import { Geist, PT_Serif } from "next/font/google";
import "./globals.css";

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
      <body className={`${geistSans.variable} ${ptSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
