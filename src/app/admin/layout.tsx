"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Gamepad2,
  Megaphone,
  ArrowLeftCircle,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { isAdminUid } from "@/lib/users";

const NAV = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/users", label: "Пользователи", icon: Users },
  { href: "/admin/products", label: "Товары", icon: Package },
  { href: "/admin/games", label: "Игры", icon: Gamepad2 },
  { href: "/admin/topups", label: "Баланс / заявки", icon: Wallet },
  { href: "/admin/ads", label: "Реклама и рассылки", icon: Megaphone },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user || !isAdminUid(user.uid)) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading || !user || !isAdminUid(user.uid)) {
    return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-white/40">Проверка доступа...</div>;
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-60 border-r border-border p-4 hidden md:flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-2 font-bold mb-6 px-2">
          <span>
            BLADE <span className="text-accent">SHOP</span>
          </span>
        </div>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm transition-colors ${
                active ? "bg-accent/15 text-accent" : "text-white/60 hover:bg-white/5"
              }`}
            >
              <Icon size={16} /> {item.label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm text-white/40 hover:bg-white/5 mt-auto"
        >
          <ArrowLeftCircle size={16} /> На сайт
        </Link>
      </aside>
      <div className="flex-1 p-5 md:p-8 overflow-x-auto">{children}</div>
    </div>
  );
}
