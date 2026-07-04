import * as React from "react";

import { SiteNav } from "./_components/site-nav";
import { SiteFooter } from "./_components/site-footer";

/**
 * Shared chrome for every marketing route: the sticky navbar and the footer.
 * Individual pages render only their own content between them.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
