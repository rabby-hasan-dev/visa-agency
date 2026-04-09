import type { Metadata } from "next";
import "./globals.css";
import Providers from "../redux/provider";

export const metadata: Metadata = {
  title: "Elite Visa Hub | Expert Immigration & Visa Services",
  description:
    "Elite Visa Hub is a leading immigration agency in Bangladesh. We provide expert guidance and visa solutions for Australia, USA, UK, Canada, and more.",
  keywords: [
    "Elite Visa Hub",
    "visa processing",
    "Australian immigration",
    "Bangladesh visa agency",
    "migration services",
  ],
  openGraph: {
    title: "Elite Visa Hub - Your Trusted Migration Partner",
    description:
      "Helping you achieve your global goals with expert immigration and visa consultancy from Dhaka.",
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
