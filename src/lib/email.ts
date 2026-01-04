import type { ReactElement } from "react";

import { Resend } from "resend";

import { env } from "@/config/env";

export const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: ReactElement;
}) {
  return resend.emails.send({ from: env.EMAIL_FROM, react, subject, to });
}
