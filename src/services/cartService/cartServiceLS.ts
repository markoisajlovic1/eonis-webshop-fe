import type { LocalCartItem } from '../../types/cart';

const LS_KEY = 'cart';

class CartServiceLS {
  getAll(): LocalCartItem[] {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]') as LocalCartItem[];
    } catch {
      return [];
    }
  }

  add(item: Omit<LocalCartItem, 'quantity'>): void {
    const items = this.getAll();
    const existing = items.find(i => i.productId === item.productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...item, quantity: 1 });
    }
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }

  update(productId: string, quantity: number): void {
    const items = this.getAll();
    const item = items.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    }
  }

  remove(productId: string): void {
    const items = this.getAll().filter(i => i.productId !== productId);
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }

  clear(): void {
    localStorage.removeItem(LS_KEY);
  }
}

export const cartServiceLS = new CartServiceLS();
