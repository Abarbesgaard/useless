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
import { Home, Heart, Archive } from "lucide-react";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";
import { Link, useLocation } from "react-router";
import { ModeToggle } from "./ModeToggle";
const items = [
  {
    title: "All",
    url: "/app/applications", // Changed from "/"
    icon: Home,
  },
  {
    title: "Favorites",
    url: "/app/favorites", // Changed from "/favorites"
    icon: Heart,
  },
  {
    title: "Archived",
    url: "/app/archived", // Changed from "/archived"
    icon: Archive,
  },
];
export default function AppSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar className=" h-full">
      <SidebarHeader>
        <h1 className="text-lg font-bold">Strackly</h1>
        <p className="text-sm ">Job Search Tracker</p>
        <p className="text-xl font-semibold">Hello, {user?.email}</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Button asChild>
                <Link to="/app/add" className="flex items-center gap-2">
                  <span>Add Application</span>
                </Link>
              </Button>
              <SidebarGroupLabel>Applications</SidebarGroupLabel>
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
        <p className="text-sm">© 2025 Strackly</p>
        <p className="text-sm">All rights reserved</p>
      </SidebarFooter>
    </Sidebar>
  );
}
