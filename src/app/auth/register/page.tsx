"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useToast } from "@/lib/toastContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast("warning", "Пароль должен быть не короче 6 символов");
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      toast("success", "Аккаунт создан! Письмо для подтверждения email отправлено.");
      router.push("/profile");
    } catch (err: any) {
      toast("error", translateAuthError(err?.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-1">Регистрация</h1>
        <p className="text-white/40 text-sm mb-6">Создай аккаунт и начни покупать предметы</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Имя пользователя"
              className="input-field pl-10"
            />
          </div>
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
              placeholder="Пароль (мин. 6 символов)"
              className="input-field pl-10"
            />
          </div>
          <button disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
            {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Уже есть аккаунт?{" "}
          <Link href="/auth/login" className="text-accent hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

function translateAuthError(code?: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Этот email уже зарегистрирован";
    case "auth/invalid-email":
      return "Некорректный email";
    case "auth/weak-password":
      return "Слишком простой пароль";
    default:
      return "Ошибка регистрации. Попробуйте снова";
  }
}
