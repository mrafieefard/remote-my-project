import { ProjectsProvider } from "../../contexts/project-context";


export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProjectsProvider>
        {children}
    </ProjectsProvider>
  );
}
