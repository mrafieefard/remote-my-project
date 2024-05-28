import { OverviewProvider } from "../../contexts/overview-context";


export default function OverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OverviewProvider>
        {children}
    </OverviewProvider>
  );
}
