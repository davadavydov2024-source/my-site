"use client";

import { useEffect, useState } from "react";
import { Search, Ban, CheckCircle, Edit3 } from "lucide-react";
import { getAllUsers, setUserBalance, setUserBan } from "@/lib/users";
import { UserProfile, BADGE_COLOR, BADGE_LABEL } from "@/types";
import { useToast } from "@/lib/toastContext";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleEditBalance(u: UserProfile) {
    const input = prompt(`Новый баланс для ${u.displayName} (текущий: ${u.balance})`, u.balance.toString());
    if (input === null) return;
    const value = Number(input);
    if (Number.isNaN(value) || value < 0) {
      toast("error", "Некорректное значение баланса");
      return;
    }
    await setUserBalance(u.uid, value);
    setUsers((list) => list.map((x) => (x.uid === u.uid ? { ...x, balance: value } : x)));
    toast("success", "Баланс обновлён");
  }

  async function handleToggleBan(u: UserProfile) {
    const banned = !u.banned;
    let reason: string | undefined;
    if (banned) {
      reason = prompt("Причина блокировки:") ?? undefined;
    }
    await setUserBan(u.uid, banned, reason, banned ? "forever" : null);
    setUsers((list) => list.map((x) => (x.uid === u.uid ? { ...x, banned, banReason: reason } : x)));
    toast(banned ? "warning" : "success", banned ? "Пользователь заблокирован" : "Пользователь разблокирован");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Пользователи</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по нику или email"
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 border-b border-border">
              <th className="p-3">Пользователь</th>
              <th className="p-3">Email</th>
              <th className="p-3">Баланс</th>
              <th className="p-3">Метки</th>
              <th className="p-3">Регистрация</th>
              <th className="p-3">Статус</th>
              <th className="p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-white/40">
                  Загрузка...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-white/40">
                  Пользователи не найдены
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.uid} className="border-b border-border/50 hover:bg-white/[0.02]">
                  <td className="p-3 font-medium">{u.displayName}</td>
                  <td className="p-3 text-white/50">{u.email}</td>
                  <td className="p-3">{u.balance.toFixed(2)} ₽</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {u.badges.map((b) => (
                        <span
                          key={b}
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ background: `${BADGE_COLOR[b]}22`, color: BADGE_COLOR[b] }}
                        >
                          {BADGE_LABEL[b]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-white/40">{new Date(u.createdAt).toLocaleDateString("ru-RU")}</td>
                  <td className="p-3">
                    {u.banned ? (
                      <span className="text-red-400 text-xs font-semibold">Заблокирован</span>
                    ) : (
                      <span className="text-green-400 text-xs font-semibold">Активен</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBalance(u)}
                        className="p-1.5 rounded-md hover:bg-white/10 text-white/60"
                        title="Изменить баланс"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleToggleBan(u)}
                        className="p-1.5 rounded-md hover:bg-white/10 text-white/60"
                        title={u.banned ? "Разблокировать" : "Заблокировать"}
                      >
                        {u.banned ? <CheckCircle size={15} /> : <Ban size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
