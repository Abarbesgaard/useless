import { NotFoundContent } from "../components/notFound";
import { Particles } from "../components/particles";

export function NotFoundPage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-y-auto overflow-x-hidden">
      <Particles />
      <div className="relative z-10 min-h-full">
        <NotFoundContent />
      </div>
    </div>
  );
}
