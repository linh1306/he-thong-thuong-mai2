import CLayout from "@/components/layout";

export default function pageAdminLayout({
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
