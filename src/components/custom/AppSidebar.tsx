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
import i18n from "../../../src/language/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AppSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation("sidebar");
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const items = [
    {
      title: t("all"),
      url: "/app/applications",
      icon: Home,
    },
    {
      title: t("favorites"),
      url: "/app/favorites",
      icon: Heart,
    },
    {
      title: t("archived"),
      url: "/app/archived",
      icon: Archive,
    },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "da" : "en";
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  };
  console.log("Available languages:", i18n.languages);
  console.log("Current language:", i18n.language);
  console.log("Current language state:", currentLang);
  console.log(
    "available translations:",
    i18n.getResourceBundle(i18n.language, "sidebar")
  );
  return (
    <Sidebar className=" h-full">
      <SidebarHeader>
        <h1 className="text-lg font-bold">{t("appName", "Strackly")}</h1>
        <p className="text-sm ">{t("appDescription", "Job Search Tracker")}</p>
        <p className="text-xl font-semibold">
          {t("hello", "Hello")}, {user?.email}
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Button asChild>
                <Link to="/app/add" className="flex items-center gap-2">
                  <span>{t("addApplication")}</span>
                </Link>
              </Button>
              <SidebarGroupLabel>
                {t("applications", "Applications")}
              </SidebarGroupLabel>
              {items.map((item) => {
                const isActive = currentPath === item.url;

                return (
                  <SidebarMenuItem key={item.url}>
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
            {t("signOut", "Sign out")}
          </Button>
          <ModeToggle />
          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className="border-2 border-muted/30 text-foreground hover:bg-foreground/10 hover:border-sidebar-border/50"
          >
            {currentLang === "en" ? "DA" : "EN"}
          </Button>
        </div>
        <p className="text-sm">{t("version", "Version")} 1.0.0</p>
        <p className="text-sm">© 2025 Strackly</p>
        <p className="text-sm">
          {t("allRightsReserved", "All rights reserved")}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
