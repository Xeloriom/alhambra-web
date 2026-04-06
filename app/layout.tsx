import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import Preloader from "@/components/ui/preloader"; // On l'importe ici

export const metadata: Metadata = {
  title: "Alhambra",
  description: "Agence créative",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="fr">
      <body className="antialiased">
      {/* Le loader est en dehors du SmoothScroll pour être toujours au-dessus */}
      <Preloader />
      <SmoothScroll>
        {children}
      </SmoothScroll>
      </body>
      </html>
  );
}