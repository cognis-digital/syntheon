import type { Metadata } from "next";

import { resolveSession } from "../_components/session";
import { SettingsTabs } from "../_components/settings-tabs";

export const metadata: Metadata = {
  title: "Settings — Syntheon",
};

export default async function SettingsPage() {
  const session = await resolveSession();
  const user = session.user;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, appearance, and billing.
        </p>
      </div>

      <SettingsTabs
        profile={{
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          email: user?.email ?? "",
        }}
      />
    </div>
  );
}
