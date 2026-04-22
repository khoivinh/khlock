import { HappyhourLogo } from "@/components/icons/happyhour-logo";
import { HappyhourWordmark } from "@/components/icons/happyhour-wordmark";
import { useTheme } from "@/lib/theme-provider";

export default function NotFound() {
  const { resolvedTheme } = useTheme();
  const logoVariant = resolvedTheme === "happy" ? "happy" : "default";
  const wordmarkColor = resolvedTheme === "dark" ? "#FFFFFF" : "#000000";

  return (
    <main className="min-h-screen bg-background">
      {/* Static header — no scroll animation, no drawer (no sidebar on 404). */}
      <header className="bg-background border-b border-border px-6 md:px-12 lg:px-24 py-8">
        <div className="mx-auto max-w-4xl flex flex-row items-center gap-4 pl-[10px] pr-[10px] sm:pr-[20px]">
          <a href="/" className="flex items-center gap-[10px] min-w-0">
            <HappyhourLogo
              variant={logoVariant}
              className="shrink-0 max-[499px]:mt-[2px]"
              style={{ width: "38px", height: "38px" }}
            />
            <div className="flex flex-col items-start pt-[9px] shrink-0">
              <HappyhourWordmark
                className="shrink-0"
                style={{ height: "43px", width: "auto", color: wordmarkColor }}
              />
            </div>
            <span className="sr-only">Happyhour</span>
          </a>
        </div>
      </header>

      {/* Error hero block — matches Figma 232-3847 */}
      <div className="px-6 md:px-12 lg:px-24 pt-[35px]">
        <div className="mx-auto max-w-4xl px-[10px]">
          <p className="h-[20px] text-[14px] leading-[20px] font-medium uppercase tracking-[0.35px] text-muted-foreground">
            Error
          </p>
          <p className="font-display text-[96px] leading-[96px] font-black tracking-[-2.4px] text-foreground">
            404
          </p>
          <p className="text-[14px] leading-[20px] text-red-500 mt-[8px]">
            Sorry, couldn’t find your page.
          </p>
        </div>
      </div>
    </main>
  );
}
