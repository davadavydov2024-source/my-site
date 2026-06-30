"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/authContext";
import { ToastProvider } from "@/lib/toastContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
