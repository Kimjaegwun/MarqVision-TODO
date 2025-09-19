import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/layout";
import { MSWComponent } from "@/components/common/msw";

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
