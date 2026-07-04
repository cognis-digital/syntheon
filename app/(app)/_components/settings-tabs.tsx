"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface SettingsProfile {
  firstName: string;
  lastName: string;
  email: string;
}

const THEMES = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
] as const;

const ACCENTS = [
  { id: "violet", label: "Violet", swatch: "hsl(262 83% 58%)" },
  { id: "grape", label: "Grape", swatch: "hsl(271 91% 65%)" },
  { id: "indigo", label: "Indigo", swatch: "hsl(243 75% 59%)" },
  { id: "fuchsia", label: "Fuchsia", swatch: "hsl(292 84% 61%)" },
] as const;

/** Profile / Appearance / Billing settings tabs. Client component: the tab
 * state and the appearance selections are interactive (local, non-persistent
 * demo state — wire to your store + next-themes at integration). */
export function SettingsTabs({ profile }: { profile: SettingsProfile }) {
  const [theme, setTheme] = React.useState<string>("system");
  const [accent, setAccent] = React.useState<string>("violet");

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      {/* Profile */}
      <TabsContent value="profile" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update how your account appears across Syntheon.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" defaultValue={profile.firstName} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" defaultValue={profile.lastName} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={profile.email} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="button">Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Appearance */}
      <TabsContent value="appearance" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Theme and accent. The accent edits token values, never the semantic names.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-medium">Theme</legend>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={theme === t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      theme === t.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-medium">Accent color</legend>
              <div className="flex flex-wrap gap-3">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    aria-label={a.label}
                    aria-pressed={accent === a.id}
                    onClick={() => setAccent(a.id)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      accent === a.id ? "border-foreground scale-105" : "border-transparent",
                    )}
                    style={{ background: a.swatch }}
                  >
                    {accent === a.id && <Check className="h-4 w-4 text-white" />}
                  </button>
                ))}
              </div>
            </fieldset>
          </CardContent>
          <CardFooter>
            <Button type="button">Save preferences</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Billing */}
      <TabsContent value="billing" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Billing</CardTitle>
              <Badge>Team</Badge>
            </div>
            <CardDescription>Manage your plan and payment method.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Team plan</p>
                <p className="text-sm text-muted-foreground">$29 / mo per seat · renews monthly</p>
              </div>
              <Button variant="outline" type="button">
                Manage plan
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Payment method</p>
                <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
              </div>
              <Button variant="outline" type="button">
                Update
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Billing runs through Stripe. Invoices are available in the customer portal.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
