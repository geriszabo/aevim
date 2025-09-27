import { ContentContainer } from "@/components/layouts/ContentContainer";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <ContentContainer>
      <div className="flex flex-col gap-10 mt-8">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-22 w-full" />
      </div>

      <Skeleton className="h-96 w-full mt-16" />
    </ContentContainer>
  );
};

export default Loading;
