import type { ReactElement } from "react";

import { Resend } from "resend";

// biome-ignore lint/style/noProcessEnv: Will be replaced with t3-env in Task 9.1
export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: ReactElement;
}) {
  // biome-ignore lint/style/noProcessEnv: Will be replaced with t3-env in Task 9.1
  const from = process.env.EMAIL_FROM ?? "noreply@example.com";

  return resend.emails.send({ from, to, subject, react });
}
