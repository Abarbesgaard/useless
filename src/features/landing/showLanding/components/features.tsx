import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "../constants/features";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export function Features() {
  const navigate = useNavigate();
  const { t } = useTranslation("landing");

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  return (
    <section id="features" className="py-24 px-5">
      <div className="container mx-auto">
        <div className="bg-transparent backdrop-blur-xl rounded-3xl p-12 border border-muted-foreground">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            {t("features.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-muted-foreground/15 border-muted-foreground backdrop-blur-sm hover:bg-foreground/15 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative cursor-pointer"
                onClick={() => handleFeatureClick(feature.path)}
              >
                <Badge
                  variant={feature.status === "WIP" ? "secondary" : "outline"}
                  className={`absolute top-3 right-3 text-xs ${
                    feature.status === "WIP"
                      ? "bg-yellow-500/20 text-chart-3 border-sidebar-border/30"
                      : "bg-gray-500/20 text-muted-foreground border-border"
                  }`}
                >
                  {feature.status}
                </Badge>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-chart-1 to-chart-4 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-foreground">
                    {t(feature.title)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 text-center leading-relaxed">
                    {t(feature.description)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
