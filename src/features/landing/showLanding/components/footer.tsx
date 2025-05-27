import { footer } from "../constants/footer";

export function Footer() {
  const handleLinkClick = (link: string) => {
    const path = `/${link.toLowerCase().replace(/\s+/g, "-")}`;
    window.location.href = path;
  };

  return (
    <footer className="py-16 px-5 border-t border-sidebar-border/10 mt-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {footer.map((section, index) => (
            <div key={index}>
              <h4 className="text-foreground font-semibold text-lg mb-5">
                {section.title}
              </h4>
              <div className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <button
                    key={linkIndex}
                    onClick={() => handleLinkClick(link)}
                    className="block text-foreground/70 hover:text-chart-4 transition-colors cursor-pointer text-left"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-sidebar-border/10 pt-8 text-center">
          <p className="text-foreground/60">
            &copy; 2025 Strackly. All rights reserved. Built for ambitious job
            seekers.
          </p>
        </div>
      </div>
    </footer>
  );
}
