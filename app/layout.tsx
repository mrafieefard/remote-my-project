import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import AnimatedLayout from "./animated-layout";
import { AlertProvider } from "./contexts/alert-context";
import { HttpProvider } from "./contexts/http-context";
import { ModalProvider } from "./contexts/modal-context";

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
          <AlertProvider>
            <HttpProvider>
              
                <ModalProvider>{children}</ModalProvider>
              
            </HttpProvider>
          </AlertProvider>
        </Providers>
      </body>
    </html>
  );
}
