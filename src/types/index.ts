export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "Обычный",
  uncommon: "Необычный",
  rare: "Редкий",
  epic: "Эпический",
  legendary: "Легендарный",
};

export interface Game {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount?: number;
}

export interface Product {
  id: string;
  gameId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rarity: Rarity;
  stock: number;
  isNew?: boolean;
  discountPercent?: number;
  createdAt: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  total: number;
  status: "pending" | "paid" | "delivered" | "cancelled";
  createdAt: number;
}

export type UserBadge =
  | "user"
  | "buyer"
  | "verified"
  | "blogger"
  | "sponsor"
  | "vip"
  | "moderator"
  | "admin"
  | "founder";

export const BADGE_LABEL: Record<UserBadge, string> = {
  user: "Пользователь",
  buyer: "Покупатель",
  verified: "Проверенный",
  blogger: "Блогер",
  sponsor: "Спонсор",
  vip: "VIP",
  moderator: "Модератор",
  admin: "Администратор",
  founder: "Основатель",
};

export const BADGE_COLOR: Record<UserBadge, string> = {
  user: "#9aa3b2",
  buyer: "#4caf50",
  verified: "#2196f3",
  blogger: "#e91e63",
  sponsor: "#9c27b0",
  vip: "#ff9800",
  moderator: "#00bcd4",
  admin: "#f44336",
  founder: "#ffd700",
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  balance: number;
  badges: UserBadge[];
  emailVerified: boolean;
  banned: boolean;
  banReason?: string;
  banUntil?: number | "forever" | null;
  createdAt: number;
  lastLoginAt: number;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
  buttonText: string;
  buttonLink: string;
  endsAt: number | null;
  priority: number;
  active: boolean;
  createdAt: number;
}

export interface TopUpRequest {
  id: string;
  userId: string;
  userNick: string;
  amount: number;
  type: "deposit" | "withdraw";
  status: "pending" | "approved" | "rejected";
  createdAt: number;
}
