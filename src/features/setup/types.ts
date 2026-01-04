export type CheckStatus = "success" | "warning" | "error" | "pending";

export type CheckResult = {
  id: string;
  name: string;
  status: CheckStatus;
  message: string;
  helpText?: string;
  copyValue?: string;
  externalLink?: string;
};

export type CheckGroup = {
  id: string;
  icon: string;
  title: string;
  checks: CheckResult[];
};
