const categories = {
  swiggy: 'food',
  zomato: 'food',
  dunzo: 'food',
  blinkit: 'food',
  uber: 'travel',
  ola: 'travel',
  rapido: 'travel',
  amazon: 'shopping',
  flipkart: 'shopping',
  myntra: 'shopping',
  netflix: 'entertainment',
  spotify: 'entertainment',
};

export const categorizeMerchant = (merchant) => {
  if (!merchant || merchant === 'Unknown') return 'others';
  
  const normalizedMerchant = merchant.toLowerCase();
  
  for (const [key, category] of Object.entries(categories)) {
    if (normalizedMerchant.includes(key)) {
      return category;
    }
  }
  
  return 'others';
};
