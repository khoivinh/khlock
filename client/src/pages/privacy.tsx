import { SitePageLayout } from "@/components/site-page-layout";
import { openCookiePreferences } from "@/lib/cookie-consent";

/** Privacy copy derived from Figma 250:4243, adjusted in the 2026-04-24 batch
 *  to reflect the new re-entry pattern for cookie preferences (floating icon
 *  removed; preferences reopen via this page's button + universal footer link). */
export default function Privacy() {
  return (
    <SitePageLayout title="Privacy">
      <p className="text-[14px] leading-[22px] text-foreground">
        When you sign in to <strong>Happyhour</strong>, we store the cities you've added and your display preferences so they sync across your devices. We use <strong>Clerk</strong> for sign-in and <strong>Cloudflare D1</strong> for storage. With your consent we use <strong>Google Analytics</strong> to understand site usage — manage your preferences anytime below. We don't sell or share your data, and we don't set advertising cookies. To delete your account and all associated data,{" "}
        <a
          href="mailto:hellodesigndept@gmail.com"
          className="font-bold underline text-inherit hover:opacity-80 transition-opacity"
        >
          send an email
        </a>
        .
      </p>

      <div className="mt-[20px] flex flex-col gap-[11px] items-start">
        <p className="text-[14px] leading-[20px] tracking-[0.35px] text-foreground">
          Manage your cookie preferences here.
        </p>
        <button
          type="button"
          onClick={openCookiePreferences}
          className="bg-[#FFD900] text-[#333] font-bold text-[10px] uppercase rounded-[6px] pt-[8px] pb-[10px] px-[12px] hover:opacity-90 transition-opacity"
        >
          Cookie preferences
        </button>
      </div>
    </SitePageLayout>
  );
}
