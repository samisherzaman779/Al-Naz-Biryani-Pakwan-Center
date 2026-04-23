import type { MenuItem } from "@/data/menu";

export const DELIVERY_FEE = 80;
export const MIN_ORDER = 300;
export const WA_NUMBER = "923452958883";

export type CartItem = MenuItem & { qty: number };

type OrderForm = {
  name: string;
  phone: string;
  address: string;
  note: string;
};

export function buildWAMessage(
  cart: CartItem[],
  form: OrderForm,
  orderType: "delivery" | "pickup",
  total: number,
) {
  const lines = cart
    .map((item) => `  • ${item.name} ×${item.qty} = Rs.${item.price * item.qty}`)
    .join("\n");
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const time = new Date().toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const msg =
    `🍛 *New Order — Al-Naz Biryani*\n\n` +
    `👤 *Name:* ${form.name}\n` +
    `📞 *Phone:* ${form.phone}\n` +
    `📦 *Type:* ${orderType === "delivery" ? "🛵 Delivery" : "🏃 Pickup/Takeaway"}\n` +
    (orderType === "delivery" ? `🏠 *Address:* ${form.address}\n` : "") +
    `🕒 *Time:* ${time}\n\n` +
    `*Items:*\n${lines}\n\n` +
    `Subtotal: Rs.${subtotal}\n` +
    (orderType === "delivery" ? `Delivery: Rs.${DELIVERY_FEE}\n` : "") +
    `*TOTAL: Rs.${total}*\n\n` +
    (form.note ? `📝 *Note:* ${form.note}\n\n` : "") +
    `_Sent from alnazbiryani.pk_`;

  return encodeURIComponent(msg);
}
