const translations: Record<string, string> = {
  dashboard: 'Kontrolna tabla',
  products: 'Proizvodi',
  brands: 'Brendovi',
  users: 'Korisnici',
  orders: 'Porudžbine',
  categories: 'Kategorije',
  coupons: 'Kodovi'
};

export const translateAdminSection = (key: string): string => {
  return translations[key] || key;
};