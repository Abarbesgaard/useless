import "./App.css";
import AuthProvider from "./contexts/authProvider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/custom/ThemeProvider";
import { BrowserRouter } from "react-router";
import { SidebarProvider } from "./components/ui/sidebar";
import AppLayout from "./shared/layout";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system">
        <SidebarProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </SidebarProvider>
        <Toaster />
        <Analytics />
      </ThemeProvider>
    </AuthProvider>
  );
}
