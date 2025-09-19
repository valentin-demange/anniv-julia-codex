import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joyeux Anniversaire Julia",
  description: "Chat d'anniversaire pour choisir le spectacle parfait",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
