import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ReactQueryProvider } from "./react-query-provider";
import { motion } from "framer-motion";
import AnimatedLayout from "./animated-layout";
import { AlertProvider, useAlertContext } from "./contexts/alert-context";

export const metadata: Metadata = {
  title: "Remote my project",
  description: "Remote my project panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <ReactQueryProvider>
            <AnimatedLayout>
              <AlertProvider>{children}</AlertProvider>
            </AnimatedLayout>
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  );
}
