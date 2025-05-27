import { Button } from "@/components/ui/button";

export function Header() {
  const handleGetStarted = () => {
    window.location.href = "/app";
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
              Features
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="text-foreground/80 hover:text-chart-4 transition-colors cursor-pointer"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-foreground/80 hover:text-chart-4 transition-colors cursor-pointer"
            >
              Contact
            </a>
          </li>
        </ul>

        <Button
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-chart-1 to-chart-4  text-foreground px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          Get Started
        </Button>
      </nav>
    </header>
  );
}
