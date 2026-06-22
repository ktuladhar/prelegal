import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeScript } from "@/components/ThemeScript";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#032147" },
    { media: "(prefers-color-scheme: dark)", color: "#071322" },
  ],
};

export const metadata: Metadata = {
  title: "Prelegal | AI Legal Document Creator",
  description: "Create professional legal documents in minutes with AI assistance. Based on Common Paper standard terms.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Prelegal | AI Legal Document Creator",
    description: "Create professional legal documents in minutes with AI assistance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sourceSerif.variable} antialiased`}>
        <ThemeScript />
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
