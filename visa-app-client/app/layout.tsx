import type { Metadata } from "next";
import "./globals.css";
import Providers from "../redux/provider";

export const metadata: Metadata = {
  title: "Immigration and Citizenship",
  description:
    "Official portal for immigration and citizenship services. Find a visa, apply for citizenship, or login to manage your applications.",
  keywords: [
    "ImmiAccount",
    "visa",
    "immigration",
    "citizenship",
    "visa application",
  ],
  openGraph: {
    title: "Immigration and Citizenship Services",
    description:
      "Access online services to apply for a visa, citizenship, or check your current visa conditions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
