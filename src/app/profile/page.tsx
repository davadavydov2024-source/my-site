"use client";

import { useAuth } from "@/lib/authContext";
import { Wallet, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { profile, user } = useAuth();
  if (!profile || !user) return null;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-xl font-bold mb-4">Личный кабинет</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass rounded-card p-4 flex items-center gap-3">
            <Wallet className="text-accent" size={22} />
            <div>
              <p className="text-xs text-white/40">Баланс</p>
              <p className="text-xl font-bold">{profile.balance.toFixed(2)} ₽</p>
            </div>
          </div>
          <div className="glass rounded-card p-4 flex items-center gap-3">
            <Mail className="text-accent" size={22} />
            <div>
              <p className="text-xs text-white/40">Email</p>
              <p className="text-sm font-medium flex items-center gap-1.5">
                {profile.email}
                {profile.emailVerified ? (
                  <CheckCircle2 size={14} className="text-green-400" />
                ) : (
                  <AlertCircle size={14} className="text-yellow-400" />
                )}
              </p>
            </div>
          </div>
        </div>
        {!profile.emailVerified && (
          <p className="text-xs text-yellow-400/80 mt-3">
            Email не подтверждён. Проверьте почту или запросите письмо повторно в разделе «Безопасность».
          </p>
        )}
        <Link href="/profile/topup" className="btn-primary inline-block mt-5 px-5 py-2.5 text-sm">
          Пополнить баланс
        </Link>
      </div>
    </div>
  );
}
