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
} from "@/components/ui/sidebar";
import { Home, Calendar, Heart } from "lucide-react";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";
import { Link, useLocation } from "react-router";
import { ModeToggle } from "./ModeToggle";
const items = [
  {
    title: "All",
    url: "/",
    icon: Home,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: Heart,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
];
export default function AppSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar className=" h-full">
      <SidebarHeader>
        <h1 className="text-lg font-bold">UseLess</h1>
        <p className="text-sm text-gray-500">Job Search Tracker</p>
        <p className="text-xl font-semibold">Hello, {user?.email}</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = currentPath === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={
                        isActive ? "bg-muted font-semibold text-primary" : ""
                      }
                    >
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className={isActive ? "text-primary" : ""} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center">
          <Button onClick={signOut} variant="outline" className="mr-2">
            Sign out
          </Button>
          <ModeToggle />
        </div>
        <p className="text-sm">Version 1.0.0</p>
        <p className="text-sm">© 2023 UseLess</p>
        <p className="text-sm">All rights reserved</p>
      </SidebarFooter>
    </Sidebar>
  );
}
