import { ContentContainer } from "@/components/layouts/ContentContainer";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePageSkeleton() {
  return (
    <PageContainer>
      <ContentContainer>
        <div className="flex flex-col gap-8">
          <Skeleton className="h-50 w-full mb-2 rounded-xl" />
          <Skeleton className="h-16 w-full mb-2 rounded-xl" />
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
