"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Tutorial } from "@/components/tutorial/Tutorial";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="top-center" />
      <Tutorial />
    </SessionProvider>
  );
}

