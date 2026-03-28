// Match amounts preceded by ₹, Rs, Rs., or INR
export const amountRegex = /(?:₹|Rs\.?|INR)\s*(\d+(?:\.\d+)?)/i;

// Match after to/for/on until the first stopword or end of string
const extractAmount = (text) => {
  const match = text.match(/(₹|Rs\.?|INR)\s?([\d,.]+)/i);
  return match ? Number(match[2].replace(/,/g, "")) : null;
};
const detectType = (text) => {
  const t = text.toLowerCase();

  if (t.includes("dr")) return "debit";
  if (t.includes("cr")) return "credit";
  if (t.includes("debited") || t.includes("spent") || t.includes("paid"))
    return "debit";
  if (t.includes("credited")) return "credit";

  return "unknown";
};
const extractMerchant = (text) => {
  let match;

  // Pattern: "to blinkit.payu@hdfcbank"
  match = text.match(/to\s([a-zA-Z0-9.\-_@]+)/i);

  if (match) {
    let raw = match[1];

    // Remove domain part
    let name = raw.split("@")[0];

    // Take first meaningful part
    name = name.split(".")[0];

    return name;
  }

  return "Unknown";
};
const extractDate = (text) => {
  const match = text.match(/\((\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2})\)/);

  if (match) {
    return new Date(match[1].replace(/:/g, "-").replace(" ", "T"));
  }

  return new Date();
};

export const parseSmsText = (text) => {
  const amount = extractAmount(text);
  const merchant = extractMerchant(text);
  const type = detectType(text);
  const date = extractDate(text);

  return {
    amount,
    merchant,
    type,
    transaction_date: date,
    raw_text: text,
  };
};
