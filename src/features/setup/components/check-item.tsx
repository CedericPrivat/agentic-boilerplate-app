"use client";

import { AlertTriangle, Check, Copy, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import type { CheckResult } from "../types";

const statusIcons = {
  error: <X className="h-4 w-4 text-red-500" />,
  pending: (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
  ),
  success: <Check className="h-4 w-4 text-green-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
};

export function CheckItem({ check }: { check: CheckResult }) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5">{statusIcons[check.status]}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{check.name}</span>
          <span className="text-sm text-muted-foreground">{check.message}</span>
        </div>
        {check.helpText && (
          <p className="text-sm text-muted-foreground">{check.helpText}</p>
        )}
        <div className="flex gap-2">
          {check.copyValue && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (check.copyValue) {
                  copyToClipboard(check.copyValue);
                }
              }}
            >
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </Button>
          )}
          {check.externalLink && (
            <Button
              variant="outline"
              size="sm"
              render={
                // biome-ignore lint/a11y/useAnchorContent: Content provided by Button children via render prop pattern
                <a
                  href={check.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              Open
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
