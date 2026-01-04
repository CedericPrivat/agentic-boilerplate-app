import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import type { ReactNode } from "react";

type EmailLayoutProps = { preview: string; children: ReactNode };

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-lg rounded border border-solid border-gray-200 p-5">
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
