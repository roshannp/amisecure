import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secureasy | Attack Surface Visibility for SMBs",
  description:
    "See what attackers can see. Free attack surface scanning for small businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
