import { Heading, Link, Text } from "@react-email/components";
import { EmailLayout } from "./components/email-layout";

type WelcomeEmailProps = { name: string };

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <EmailLayout preview={`Welcome to Agentic App, ${name}!`}>
      <Heading className="text-2xl font-bold text-gray-900">
        Welcome, {name}!
      </Heading>
      <Text className="text-gray-600">
        Thank you for signing up. We are excited to have you on board.
      </Text>
      <Text className="text-gray-600">
        If you have any questions, feel free to{" "}
        <Link href="mailto:support@example.com" className="text-blue-600">
          contact us
        </Link>
        .
      </Text>
    </EmailLayout>
  );
}
