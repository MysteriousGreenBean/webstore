import type { Metadata } from "next";
import { BasketProvider } from "@/components/basket-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Moongazer Supply",
    template: "%s | Moongazer Supply",
  },
  description: "Useful technology, thoughtfully selected.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <BasketProvider>
          <a className="skip-link" href="#main-content">
            Skip to main content
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </BasketProvider>
      </body>
    </html>
  );
}
