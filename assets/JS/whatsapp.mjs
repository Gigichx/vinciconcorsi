export function createWhatsAppUrl(number, message) {
  if (typeof number !== "string" || !/^\+?[1-9]\d{7,14}$/.test(number)) return null;
  return `https://wa.me/${number.replace(/^\+/, "")}?text=${encodeURIComponent(message)}`;
}
