import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ApplicationLoadingSkeleton = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="w-4xl p-3">
        <Card className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-3 w-[60%]" />
          <div className="flex space-x-2 pt-4">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </Card>
      </div>
    ))}
  </>
);
