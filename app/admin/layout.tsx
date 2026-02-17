import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import Footer from "@/components/Layout/Footer";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export const metadata = {
  title: {
    default: "Admin",
    template: "Admin | %s",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex min-h-[calc(100vh-4rem)] flex-col">
        <header className="bg-background sticky top-16 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">
              Admin Dashboard
            </span>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <Footer />
      </SidebarInset>
      <Toaster position="top-right" richColors closeButton />
    </SidebarProvider>
  );
}
