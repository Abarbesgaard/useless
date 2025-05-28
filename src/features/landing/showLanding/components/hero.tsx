import { Button } from "@/components/ui/button";

export function Hero() {
  const handleGetStarted = () => {
    window.location.href = "/app";
  };

  return (
    <section className="text-center py-24 px-5">
      <div className="container mx-auto">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-muted-foreground to-chart-4 bg-clip-text text-transparent ">
          Track Your Path to Success
        </h1>
        <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Streamline your job search with intelligent application tracking,
          deadline management, and career insights. Never miss an opportunity
          again.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-sidebar-border to-chart-4 hover:from-sidebar-primary hover:to-chart-4 text-foreground px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 w-full sm:w-auto cursor-pointer"
          >
            Start Tracking Free
          </Button>
          <Button
            variant="outline"
            className="border-2 border-muted/30 text-foreground hover:bg-foreground/10 hover:border-sidebar-border/50 px-8 py-4 rounded-full text-lg font-semibold transition-all w-full sm:w-auto cursor-pointer"
          >
            See Guide
          </Button>
        </div>
      </div>
    </section>
  );
}
