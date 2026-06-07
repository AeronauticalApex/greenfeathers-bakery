// Single source of truth for the bakery's contact details, reused across pages.

export const BUSINESS = {
  name: "Greenfeathers Farm Bakery",
  address: "548 Eureka Road, Springfield, Vermont 05156",
  phoneDisplay: "(802) 245-9095",
  phoneRaw: "8022459095",
  instagramHandle: "greenfeathersfarm",
  instagramUrl: "https://instagram.com/greenfeathersfarm",
} as const;

// Tap-to-text link. Prefilled body helps customers start their order.
export const SMS_LINK = `sms:+1${BUSINESS.phoneRaw}?&body=${encodeURIComponent(
  "Hi Greenfeathers! I'd like to order: ",
)}`;

export const TEL_LINK = `tel:+1${BUSINESS.phoneRaw}`;

// Google Maps embed for the Find Us page (no API key required).
export const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  BUSINESS.address,
)}&output=embed`;
