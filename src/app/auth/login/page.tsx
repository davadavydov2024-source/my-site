"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useToast } from "@/lib/toastContext";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast("success", "Вы успешно вошли в аккаунт");
      router.push("/profile");
    } catch (err: any) {
      toast("error", translateAuthError(err?.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      await loginWithGoogle();
      toast("success", "Вы успешно вошли через Google");
      router.push("/profile");
    } catch {
      toast("error", "Не удалось войти через Google");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-1">Вход в аккаунт</h1>
        <p className="text-white/40 text-sm mb-6">Рады видеть тебя снова в Blade Shop</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="input-field pl-10"
            />
          </div>
          <div className="text-right">
            <Link href="/auth/reset" className="text-xs text-accent hover:underline">
              Забыли пароль?
            </Link>
          </div>
          <button disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-white/30">или</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button onClick={handleGoogle} className="btn-secondary w-full py-3">
          Войти через Google
        </button>

        <p className="text-center text-sm text-white/40 mt-6">
          Нет аккаунта?{" "}
          <Link href="/auth/register" className="text-accent hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}

function translateAuthError(code?: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Неверный email или пароль";
    case "auth/user-not-found":
      return "Пользователь с таким email не найден";
    case "auth/too-many-requests":
      return "Слишком много попыток. Попробуйте позже";
    default:
      return "Ошибка входа. Проверьте данные и попробуйте снова";
  }
}
