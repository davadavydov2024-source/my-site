import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

interface SendEmailParams {
  to_email: string;
  to_name?: string;
  subject?: string;
  message: string;
  [key: string]: string | undefined;
}

/**
 * Отправляет письмо через EmailJS используя шаблон, заданный в .env.local.
 * Поля передаваемого объекта должны совпадать с переменными в самом шаблоне EmailJS
 * (зайди в EmailJS Dashboard -> Email Templates -> template_qo1n6m8, чтобы проверить названия переменных).
 */
export async function sendEmail(params: SendEmailParams) {
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
}

export async function sendVerificationCodeEmail(toEmail: string, code: string, name?: string) {
  return sendEmail({
    to_email: toEmail,
    to_name: name ?? toEmail,
    subject: "Подтверждение Email — Blade Shop",
    message: `Ваш код подтверждения: ${code}. Он действует 15 минут.`,
    code,
  });
}

export async function sendBroadcastEmail(toEmail: string, title: string, text: string, buttonText?: string, buttonLink?: string) {
  return sendEmail({
    to_email: toEmail,
    subject: title,
    message: text,
    button_text: buttonText ?? "",
    button_link: buttonLink ?? "",
  });
}
