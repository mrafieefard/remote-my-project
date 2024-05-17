
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ReactQueryProvider } from "./react-query-provider";
import { motion } from "framer-motion";
import AnimatedLayout from "./animated-layout";

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
            {children}
           </AnimatedLayout>
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  );
}
