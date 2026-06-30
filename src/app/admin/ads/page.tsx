"use client";

import { useEffect, useState } from "react";
import { Send, Megaphone, Mail, Plus, Trash2, Edit3, Power } from "lucide-react";
import { getAllUsers } from "@/lib/users";
import { sendBroadcastEmail } from "@/lib/emailjs";
import { getAds, createAd, updateAd, deleteAd } from "@/lib/ads";
import { Ad } from "@/types";
import { useToast } from "@/lib/toastContext";

const EMPTY_AD: Omit<Ad, "id" | "createdAt"> = {
  title: "",
  description: "",
  image: "",
  color: "#ff9800",
  buttonText: "",
  buttonLink: "",
  endsAt: null,
  priority: 0,
  active: true,
};

export default function AdminAdsPage() {
  const [tab, setTab] = useState<"ads" | "broadcast">("broadcast");
  const { toast } = useToast();

  // --- broadcast state ---
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  // --- ads state ---
  const [ads, setAds] = useState<Ad[]>([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [form, setForm] = useState(EMPTY_AD);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (tab === "ads") refreshAds();
  }, [tab]);

  async function refreshAds() {
    setAdsLoading(true);
    try {
      setAds(await getAds());
    } catch {
      toast("error", "Не удалось загрузить рекламу");
    } finally {
      setAdsLoading(false);
    }
  }

  function openCreateAd() {
    setEditing(null);
    setForm(EMPTY_AD);
    setShowForm(true);
  }

  function openEditAd(ad: Ad) {
    setEditing(ad);
    setForm({ ...ad });
    setShowForm(true);
  }

  async function handleSaveAd(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) {
        await updateAd(editing.id, form);
        toast("success", "Реклама обновлена");
      } else {
        await createAd(form);
        toast("success", "Реклама создана");
      }
      setShowForm(false);
      refreshAds();
    } catch {
      toast("error", "Ошибка сохранения рекламы");
    }
  }

  async function handleDeleteAd(ad: Ad) {
    if (!confirm(`Удалить рекламу «${ad.title}»?`)) return;
    await deleteAd(ad.id);
    setAds((list) => list.filter((x) => x.id !== ad.id));
    toast("success", "Реклама удалена");
  }

  async function handleToggleActive(ad: Ad) {
    await updateAd(ad.id, { active: !ad.active });
    setAds((list) => list.map((x) => (x.id === ad.id ? { ...x, active: !x.active } : x)));
  }

  async function handleSendBroadcast() {
    if (!title || !text) {
      toast("warning", "Заполните заголовок и текст рассылки");
      return;
    }
    setSending(true);
    try {
      const users = await getAllUsers();
      setProgress({ done: 0, total: users.length });
      // EmailJS отправляет по одному письму за раз — для большой базы это может занять время.
      // Для production-нагрузки лучше перенести рассылку на серверный SDK (Resend/SendGrid) через Cloud Function.
      for (let i = 0; i < users.length; i++) {
        const u = users[i];
        try {
          await sendBroadcastEmail(u.email, title, text, buttonText, buttonLink);
        } catch {
          // не прерываем рассылку из-за одного неудачного письма
        }
        setProgress({ done: i + 1, total: users.length });
      }
      toast("success", `Рассылка отправлена ${users.length} пользователям`);
      setTitle("");
      setText("");
      setButtonText("");
      setButtonLink("");
    } catch {
      toast("error", "Ошибка при отправке рассылки");
    } finally {
      setSending(false);
      setProgress(null);
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Реклама и рассылка</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("ads")}
          className={`px-4 py-2 rounded-btn text-sm font-medium flex items-center gap-2 ${
            tab === "ads" ? "bg-accent text-black" : "bg-surface text-white/60"
          }`}
        >
          <Megaphone size={15} /> Реклама
        </button>
        <button
          onClick={() => setTab("broadcast")}
          className={`px-4 py-2 rounded-btn text-sm font-medium flex items-center gap-2 ${
            tab === "broadcast" ? "bg-accent text-black" : "bg-surface text-white/60"
          }`}
        >
          <Mail size={15} /> Рассылка
        </button>
      </div>

      {tab === "broadcast" ? (
        <div className="card p-5 space-y-4 max-w-xl">
          <p className="text-xs text-white/40">
            Письмо уйдёт всем зарегистрированным пользователям через EmailJS, используя шаблон template_qo1n6m8.
          </p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заголовок"
            className="input-field py-2.5"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Текст сообщения для рассылки..."
            rows={5}
            className="input-field py-2.5"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Текст кнопки (необязательно)"
              className="input-field py-2.5"
            />
            <input
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="Ссылка кнопки"
              className="input-field py-2.5"
            />
          </div>
          <button
            onClick={handleSendBroadcast}
            disabled={sending}
            className="btn-primary px-6 py-3 flex items-center gap-2 disabled:opacity-50"
          >
            <Send size={16} /> {sending ? `Отправка ${progress?.done ?? 0}/${progress?.total ?? "?"}...` : "Отправить всем"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={openCreateAd} className="btn-primary px-4 py-2.5 text-sm flex items-center gap-2">
            <Plus size={16} /> Создать рекламу
          </button>

          {showForm && (
            <form onSubmit={handleSaveAd} className="card p-5 grid sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Заголовок"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field py-2.5"
              />
              <input
                placeholder="URL изображения (необязательно)"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="input-field py-2.5"
              />
              <textarea
                placeholder="Описание"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field py-2.5 sm:col-span-2"
                rows={2}
              />
              <div className="flex items-center gap-2">
                <label className="text-xs text-white/40 shrink-0">Цвет</label>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="h-10 w-16 rounded-btn bg-surface border border-border"
                />
              </div>
              <input
                type="number"
                placeholder="Приоритет (чем выше — тем выше в списке)"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                className="input-field py-2.5"
              />
              <input
                placeholder="Текст кнопки"
                value={form.buttonText}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                className="input-field py-2.5"
              />
              <input
                placeholder="Ссылка кнопки"
                value={form.buttonLink}
                onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                className="input-field py-2.5"
              />
              <input
                type="date"
                value={form.endsAt ? new Date(form.endsAt).toISOString().slice(0, 10) : ""}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value ? new Date(e.target.value).getTime() : null })}
                className="input-field py-2.5"
              />
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                Активна
              </label>
              <div className="sm:col-span-2 flex gap-3">
                <button className="btn-primary px-5 py-2.5 text-sm">{editing ? "Сохранить" : "Создать"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary px-5 py-2.5 text-sm">
                  Отмена
                </button>
              </div>
            </form>
          )}

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/40 border-b border-border">
                  <th className="p-3">Заголовок</th>
                  <th className="p-3">Приоритет</th>
                  <th className="p-3">Окончание</th>
                  <th className="p-3">Статус</th>
                  <th className="p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {adsLoading ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-white/40">
                      Загрузка...
                    </td>
                  </tr>
                ) : ads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-white/40">
                      Реклама ещё не создана
                    </td>
                  </tr>
                ) : (
                  ads.map((ad) => (
                    <tr key={ad.id} className="border-b border-border/50 hover:bg-white/[0.02]">
                      <td className="p-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: ad.color }} />
                        {ad.title}
                      </td>
                      <td className="p-3 text-white/50">{ad.priority}</td>
                      <td className="p-3 text-white/50">
                        {ad.endsAt ? new Date(ad.endsAt).toLocaleDateString("ru-RU") : "Бессрочно"}
                      </td>
                      <td className="p-3">
                        {ad.active ? (
                          <span className="text-green-400 text-xs font-semibold">Активна</span>
                        ) : (
                          <span className="text-white/30 text-xs font-semibold">Выключена</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleToggleActive(ad)} className="p-1.5 rounded-md hover:bg-white/10 text-white/60" title="Вкл/выкл">
                            <Power size={15} />
                          </button>
                          <button onClick={() => openEditAd(ad)} className="p-1.5 rounded-md hover:bg-white/10 text-white/60">
                            <Edit3 size={15} />
                          </button>
                          <button onClick={() => handleDeleteAd(ad)} className="p-1.5 rounded-md hover:bg-white/10 text-red-400">
                            <Trash2 size={15} />
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
      )}
    </div>
  );
}

