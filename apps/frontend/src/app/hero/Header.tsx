import { ContentContainer } from "@/components/layouts/ContentContainer";
import { Logo } from "@/components/Logo/Logo";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
      <ContentContainer className="py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <a
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </a>
        </div>
      </ContentContainer>
    </header>
  )
}