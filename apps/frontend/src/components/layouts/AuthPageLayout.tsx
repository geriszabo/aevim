import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo/Logo";
import { PageContainer } from "@/components/layouts/PageContainer";
import { useRouter } from "next/navigation";

interface AuthPageLayoutProps {
  children: ReactNode;
  subtitle?: string;
}

export const AuthPageLayout = ({
  children,
  subtitle = "Log with power, train with purpose",
}: AuthPageLayoutProps) => {
  const router = useRouter();

  return (
    <PageContainer justifyContent="center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
