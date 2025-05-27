import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Features } from "../components/features";
import { Footer } from "../components/footer";
import { Particles } from "../components/particles";

export function LandingPage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-chart-1 via-sidebar-primary to-background text-foreground overflow-y-auto overflow-x-hidden">
      <Particles />
      <div className="relative z-10 min-h-full">
        <Header />
        <main>
          <Hero />
          <Features />
          {/* <Stats /> */}
        </main>
        <Footer />
      </div>
    </div>
  );
}
