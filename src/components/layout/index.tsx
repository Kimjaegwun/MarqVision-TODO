"use client";

import styles from "./index.module.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.layout}>{children}</div>
    </QueryClientProvider>
  );
};

export default Layout;
