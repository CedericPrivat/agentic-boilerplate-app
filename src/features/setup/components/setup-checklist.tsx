"use client";

import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { runAllChecks } from "../actions";
import type { CheckGroup } from "../types";

import { CheckItem } from "./check-item";

export function SetupChecklist() {
  const t = useTranslations("setup");
  const [groups, setGroups] = useState<CheckGroup[]>([]);
  const [lastChecked, setLastChecked] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    startTransition(async () => {
      const result = await runAllChecks();
      setGroups(result.groups);
      setLastChecked(result.lastChecked);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const completedCount = groups.reduce(
    (acc, group) =>
      acc + group.checks.filter((c) => c.status === "success").length,
    0,
  );
  const totalCount = groups.reduce(
    (acc, group) => acc + group.checks.length,
    0,
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {completedCount}/{totalCount} checks passing
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastChecked && (
            <span className="text-sm text-muted-foreground">
              {t("lastChecked", {
                time: new Date(lastChecked).toLocaleTimeString(),
              })}
            </span>
          )}
          <Button onClick={refresh} disabled={isPending} variant="outline">
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`}
            />
            {t("recheckAll")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span>{group.icon}</span>
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {group.checks.map((check) => (
                <CheckItem key={check.id} check={check} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
