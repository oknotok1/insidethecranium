"use client";

import { Database, Music, Key, LogOut, ChevronRight, List, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navigationItems = [
  {
    title: "Cache Management",
    url: "/admin",
    icon: Database,
  },
  {
    title: "Spotify Authentication",
    url: "/admin/spotify/auth",
    icon: Key,
  },
];

// Helper to get page name from pathname
const getPageName = (pathname: string): string => {
  if (pathname === "/admin") return "Cache Management";
  if (pathname === "/admin/spotify/auth") return "Spotify Authentication";
  if (pathname === "/admin/content/concerts") return "Manage Concerts";
  if (pathname.startsWith("/admin/content/concerts/") && pathname.endsWith("/edit")) return "Edit Concert";
  if (pathname === "/admin/content/concerts/new") return "Add New Concert";
  return "Admin";
};

interface Concert {
  id: string;
  slug: string;
  title: string;
  published: boolean;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [concerts, setConcerts] = useState<Concert[]>([]);

  useEffect(() => {
    async function fetchConcerts() {
      try {
        const response = await fetch("/api/concerts/debug");
        if (response.ok) {
          const data = await response.json();
          console.log("[AdminSidebar] Fetched concerts:", data.concerts);
          setConcerts(data.concerts || []);
        } else {
          console.error("[AdminSidebar] Failed to fetch concerts:", response.status);
        }
      } catch (error) {
        console.error("[AdminSidebar] Failed to fetch concerts:", error);
      }
    }

    if (session) {
      console.log("[AdminSidebar] Session detected, fetching concerts");
      fetchConcerts();
    } else {
      console.log("[AdminSidebar] No session, skipping concert fetch");
    }
  }, [session]);

  return (
    <Sidebar className="**:data-[slot='sidebar-container']:md:top-16! **:data-[slot='sidebar-container']:md:h-[calc(100vh-4rem)]!">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3d38f5] dark:bg-[#8b87ff]">
            <Music className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Admin Dashboard</span>
            <span className="text-xs text-muted-foreground">{getPageName(pathname)}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Manage Concerts Dropdown */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      isActive={pathname.startsWith('/admin/content/concerts')}
                      tooltip="Manage Concerts"
                    >
                      <Music />
                      <span>Manage Concerts</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {concerts.map((concert) => (
                        <SidebarMenuSubItem key={concert.id}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={pathname === `/admin/content/concerts/${concert.id}/edit`}
                          >
                            <Link href={`/admin/content/concerts/${concert.id}/edit`}>
                              <div className={`h-2 w-2 shrink-0 rounded-full ${concert.published ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span className="truncate">{concert.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === '/admin/content/concerts'}>
                          <Link href="/admin/content/concerts">
                            <List className="h-4 w-4" />
                            <span className="font-medium">All Concerts</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === '/admin/content/concerts/new'}>
                          <Link href="/admin/content/concerts/new">
                            <Plus className="h-4 w-4" />
                            <span className="font-medium">Add New Concert</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {session?.user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <Collapsible className="group/user-menu">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="h-auto py-2 data-[state=open]:bg-sidebar-accent">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3d38f5] text-sm font-semibold text-white dark:bg-[#8b87ff]">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                      </div>
                      <div className="flex flex-1 flex-col items-start overflow-hidden text-left">
                        <p className="truncate text-sm font-medium">{session.user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/user-menu:rotate-90" />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => signOut({ callbackUrl: "/admin" })}
                        className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
