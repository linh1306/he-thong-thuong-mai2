import CLayout from "@/components/layout";

export default function pageEmployeeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CLayout>
      {children}
    </CLayout>
  );
}
