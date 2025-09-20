"use client";

import { useEffect, useState } from "react";
import styles from "./msw.module.css";

export const MSWComponent = ({ children }: { children: React.ReactNode }) => {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const initMsw = await import("@/hooks").then((res) => res.initMsw);
      await initMsw();
      setMswReady(true);
    };

    if (!mswReady) {
      init();
    }
  }, [mswReady]);

  return mswReady ? (
    <>{children}</>
  ) : (
    <div className={styles.loaderContainer}>
      <div className={styles.loader} />
    </div>
  );
};
