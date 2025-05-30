import { Button } from "@/components/ui/button";
import i18n from "../../../../language/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function Header() {
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const { t } = useTranslation("landing");

  const handleGetStarted = () => {
    window.location.href = "/app/applications";
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "da" : "en";
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  };

  return (
    <header className="relative z-50 p-5">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-4 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="absolute w-4 h-4 bg-foreground rounded-sm top-2 left-2" />
            <div className="absolute w-2 h-2 bg-foreground rounded-sm bottom-2 right-2" />
          </div>
          <span className="text-2xl font-bold text-foreground">Strackly</span>
        </div>

        <ul className="hidden md:flex items-center gap-8">
          <li>
            <a
              href="#features"
              className="text-foreground/80 hover:text-chart-4 transition-colors cursor-pointer"
            >
              {t("header.features")}
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="text-foreground/80 hover:text-chart-4 transition-colors cursor-pointer"
            >
              {t("header.about")}
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-foreground/80 hover:text-chart-4 transition-colors cursor-pointer"
            >
              {t("header.contact")}
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className="border-2 border-muted/30 text-foreground hover:bg-foreground/10 hover:border-sidebar-border/50"
          >
            {currentLang === "en" ? "DA" : "EN"}
          </Button>
          <Button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-chart-1 to-chart-4  text-foreground px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            {t("header.getStarted")}
          </Button>
        </div>
      </nav>
    </header>
  );
}
