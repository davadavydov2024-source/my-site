"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { getOrdersForUser } from "@/lib/users";
import { Order } from "@/types";

const STATUS_LABEL: Record<Order["status"], { text: string; color: string }> = {
  pending: { text: "В обработке", color: "#ff9800" },
  paid: { text: "Оплачен", color: "#4caf50" },
  delivered: { text: "Доставлен", color: "#2196f3" },
  cancelled: { text: "Отменён", color: "#f44336" },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getOrdersForUser(user.uid)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="card p-10 text-center text-white/40">Загрузка истории...</div>;
  if (orders.length === 0) return <div className="card p-10 text-center text-white/40">У вас пока нет заказов.</div>;

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold mb-2">История покупок</h1>
      {orders.map((order) => (
        <div key={order.id} className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-white/40">Заказ #{order.id.slice(0, 8)}</p>
            <span
              className="text-xs font-semibold px-2 py-1 rounded-md"
              style={{ background: `${STATUS_LABEL[order.status].color}22`, color: STATUS_LABEL[order.status].color }}
            >
              {STATUS_LABEL[order.status].text}
            </span>
          </div>
          <div className="space-y-1 text-sm text-white/70">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {item.name} ×{item.quantity}
                </span>
                <span>{(item.price * item.quantity).toFixed(2)} ₽</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border">
            <span>Итого</span>
            <span className="text-accent">{order.total.toFixed(2)} ₽</span>
          </div>
        </div>
      ))}
    </div>
  );
}
