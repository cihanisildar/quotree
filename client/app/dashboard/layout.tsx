import ClientWrapper from "@/components/client-wrapper";
import { SidebarLayout } from "@/components/sidebar-layout";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dashboard-layout">
      <SidebarLayout>
        <ClientWrapper>{children}</ClientWrapper>
      </SidebarLayout>
    </div>
  );
}
