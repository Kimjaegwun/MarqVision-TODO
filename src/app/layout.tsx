import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/features/todo/components/layout";
import { MSWComponent } from "@/shared/components/msw";

export const metadata: Metadata = {
  title: "Marq Todo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Layout>
          <MSWComponent>{children}</MSWComponent>
        </Layout>
      </body>
    </html>
  );
}
