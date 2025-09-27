import { ContentContainer } from "@/components/layouts/ContentContainer";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <ContentContainer>
      <div className="flex flex-col gap-16 mt-8">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
      <Skeleton className="h-14 w-full mt-4" />
    </ContentContainer>
  );
};

export default Loading;
