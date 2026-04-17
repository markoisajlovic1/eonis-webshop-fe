import { FiUser, FiShoppingBag } from "react-icons/fi";
import { type ReactNode } from "react";

export interface SidebarItem {
  label: string;
  path: string;
  icon: ReactNode;
  end?: boolean;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Uredi profil',
    path: '/profile',
    icon: <FiUser className="text-xl" />,
    end: true
  },
  {
    label: 'Moje porudžbine',
    path: '/profile/orders',
    icon: <FiShoppingBag className="text-xl" />
  }
];
