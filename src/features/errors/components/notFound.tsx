import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NotFoundContent() {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoToApp = () => {
    window.location.href = "/app";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-5">
      <div className="mb-8">
        <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-white/80 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Card className="bg-white/10 border-white/10 backdrop-blur-sm p-8 mb-8">
        <CardContent className="space-y-4">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white">Lost your way?</h3>
          <p className="text-white/70">
            Don't worry, even the best job hunters take wrong turns sometimes.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleGoHome}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
        >
          Go Home
        </Button>
        <Button
          onClick={handleGoToApp}
          variant="outline"
          className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-3 rounded-full font-semibold transition-all"
        >
          Go to App
        </Button>
      </div>
    </div>
  );
}
