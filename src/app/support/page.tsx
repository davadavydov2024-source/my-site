"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

const FAQ = [
  { q: "Как пополнить баланс?", a: "Перейдите в личный кабинет → Пополнение баланса, создайте заявку и подтвердите её в Telegram-боте администратора." },
  { q: "Как быстро приходит товар?", a: "Обычно доставка занимает от нескольких минут до пары часов после оплаты заказа." },
  { q: "Что делать, если товар не пришёл?", a: "Напишите в поддержку с номером заказа — мы разберёмся в течение суток." },
  { q: "Можно ли вернуть деньги?", a: "Да, если товар не был выдан. Свяжитесь с поддержкой, приложив номер заказа." },
];

export default function SupportPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Поддержка</h1>
      <p className="text-white/40 mb-8">Мы на связи и поможем решить любой вопрос.</p>

      <div className="card p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="font-medium">Связаться в Telegram</p>
          <p className="text-sm text-white/40">Самый быстрый способ получить ответ</p>
        </div>
        <a
          href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT || "bladeshop_robot"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary px-5 py-2.5 flex items-center gap-2 text-sm"
        >
          Открыть бота <ExternalLink size={14} />
        </a>
      </div>

      <h2 id="faq" className="text-xl font-bold mb-4">
        Частые вопросы
      </h2>
      <div className="space-y-2">
        {FAQ.map((item, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-medium text-sm">{item.q}</span>
              <ChevronDown
                size={18}
                className={`text-white/40 transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && <div className="px-4 pb-4 text-sm text-white/50">{item.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
