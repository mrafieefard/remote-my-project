import { UsersProvider } from "../../contexts/users-context";


export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UsersProvider>
        {children}
    </UsersProvider>
  );
}
