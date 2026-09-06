export type ContactSettings = {
  phone: string;
  alternativePhone: string;
};

export const defaultContactSettings: ContactSettings = {
  phone: "063 234 4970",
  alternativePhone: "",
};

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("27") ? digits : `27${digits.replace(/^0/, "")}`}`;
}
