"use client";

import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "@/lib/authContext";
import { useToast } from "@/lib/toastContext";

export default function SecurityPage() {
  const { user, profile, resetPassword } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  async function resendVerification() {
    if (!user) return;
    setSending(true);
    try {
      await sendEmailVerification(user);
      toast("success", "Письмо отправлено повторно");
    } catch {
      toast("error", "Не удалось отправить письмо");
    } finally {
      setSending(false);
    }
  }

  async function handleResetPassword() {
    if (!profile) return;
    try {
      await resetPassword(profile.email);
      toast("success", "Письмо для смены пароля отправлено на ваш email");
    } catch {
      toast("error", "Не удалось отправить письмо");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold mb-2">Безопасность</h1>

      <div className="card p-5 flex items-center justify-between">
        <div>
          <p className="font-medium">Подтверждение email</p>
          <p className="text-sm text-white/40">{profile?.emailVerified ? "Email подтверждён" : "Email не подтверждён"}</p>
        </div>
        {!profile?.emailVerified && (
          <button onClick={resendVerification} disabled={sending} className="btn-secondary px-4 py-2 text-sm">
            {sending ? "Отправка..." : "Отправить письмо"}
          </button>
        )}
      </div>

      <div className="card p-5 flex items-center justify-between">
        <div>
          <p className="font-medium">Пароль</p>
          <p className="text-sm text-white/40">Сменить пароль через письмо на email</p>
        </div>
        <button onClick={handleResetPassword} className="btn-secondary px-4 py-2 text-sm">
          Сменить пароль
        </button>
      </div>

      <div className="card p-5">
        <p className="font-medium mb-1">Двухфакторная аутентификация (2FA)</p>
        <p className="text-sm text-white/40">Скоро будет доступно.</p>
      </div>
    </div>
  );
}
