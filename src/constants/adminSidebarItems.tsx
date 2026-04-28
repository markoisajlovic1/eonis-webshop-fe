import { FiGrid, FiBox, FiTag } from 'react-icons/fi'
import { TbBrandSketch, TbCategory2 } from 'react-icons/tb'
import { LiaShippingFastSolid } from 'react-icons/lia'
import { type ReactNode } from 'react'

export interface AdminSidebarItem {
  label: string
  path: string
  icon: (isActive: boolean) => ReactNode
  end?: boolean
}

export const ADMIN_SIDEBAR_ITEMS: AdminSidebarItem[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    end: true,
    icon: (isActive) => (
      <FiGrid className={`text-xl ${isActive ? 'text-amber-500' : 'text-neutral-500'}`} />
    ),
  },
  {
    label: 'Proizvodi',
    path: '/admin/products',
    icon: (isActive) => (
      <FiBox className={`text-xl ${isActive ? 'text-amber-500' : 'text-neutral-500'}`} />
    ),
  },
  {
    label: 'Kuponi',
    path: '/admin/coupons',
    icon: (isActive) => (
      <FiTag className={`text-xl ${isActive ? 'text-amber-500' : 'text-neutral-500'}`} />
    ),
  },
  {
    label: 'Brendovi',
    path: '/admin/brands',
    icon: (isActive) => (
      <TbBrandSketch className={`text-xl ${isActive ? 'text-amber-500' : 'text-neutral-500'}`} />
    ),
  },
  {
    label: 'Kategorije',
    path: '/admin/categories',
    icon: (isActive) => (
      <TbCategory2 className={`text-xl ${isActive ? 'text-amber-500' : 'text-neutral-500'}`} />
    ),
  },
  {
    label: 'Porudzbine',
    path: '/admin/orders',
    icon: (isActive) => (
      <LiaShippingFastSolid className={`text-xl ${isActive ? 'text-amber-500' : 'text-neutral-500'}`} />
    ),
  },
]
