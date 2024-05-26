import CLayout from "@/components/layout";

export default function pagePublicLayout({
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
