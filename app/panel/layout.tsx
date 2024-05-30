import AnimatedLayout from "../animated-layout";
import Nav from "./nav";

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col">
      <Nav />
      <AnimatedLayout>{children}</AnimatedLayout>
    </main>
  );
}
