import { Toaster } from "sonner";
import { auth } from "@/auth";

import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import Footer from "@/components/Layout/Footer";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const metadata = {
  title: {
    default: "Admin",
    template: "Admin | %s",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAuthenticated = !!session;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col">
        <main className="flex flex-1 items-center justify-center">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </div>
    );
  }

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
