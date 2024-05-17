import Nav from "./nav";

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col">
      <Nav />
      {children}
    </main>
  );
}
