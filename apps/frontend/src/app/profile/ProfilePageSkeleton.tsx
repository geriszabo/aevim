import { ContentContainer } from "@/components/layouts/ContentContainer";
import { Skeleton } from "@/components/ui/skeleton";

function FieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full rounded-xl " />
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <ContentContainer>
      <div className="space-y-8" aria-busy="true" aria-live="polite">
        <div>
          <Skeleton className="h-7 w-56 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
        </div>

        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </ContentContainer>
  );
}
