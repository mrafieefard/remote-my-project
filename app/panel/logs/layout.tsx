import { LogsProvider } from "../../contexts/log-context";


export default function LogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LogsProvider>
        {children}
    </LogsProvider>
  );
}
