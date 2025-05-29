import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function Hero() {
  const { t } = useTranslation();

  const handleGetStarted = () => {
    window.location.href = "/app";
  };

  return (
    <section className="text-center py-24 px-5">
      <div className="container mx-auto">
        <div className="flex justify-end mb-4"></div>
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-muted-foreground to-chart-4 bg-clip-text text-transparent ">
          {t("hero.title")}
        </h1>
        <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("hero.description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-sidebar-border to-chart-4 hover:from-sidebar-primary hover:to-chart-4 text-foreground px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 w-full sm:w-auto cursor-pointer"
          >
            {t("hero.startButton")}
          </Button>
          <Button
            variant="outline"
            className="border-2 border-muted/30 text-foreground hover:bg-foreground/10 hover:border-sidebar-border/50 px-8 py-4 rounded-full text-lg font-semibold transition-all w-full sm:w-auto cursor-pointer"
          >
            {t("hero.guideButton")}
          </Button>
        </div>
      </div>
    </section>
  );
}
