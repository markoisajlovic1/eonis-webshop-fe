import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/user/HomePage';
import AuthPage from '../pages/shared/AuthPage';
import CatalogPage from '../pages/user/CatalogPage';
import ProfilePage from '../pages/user/ProfilePage';
import EditProfilePage from '../pages/user/EditProfilePage';
import OrdersPage from '../pages/user/OrdersPage';
import ProtectedRoute from './ProtectedRoute';
import { Role } from '../types/auth';
import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';
import ProductsPage from '../pages/admin/ProductsPage';
import AdminProductPage from '../pages/admin/AdminProductPage';
import CouponsPage from '../pages/admin/CouponsPage';
import ProductPage from '../pages/user/ProductPage';
import BrandsPage from '../pages/admin/BrandsPage';
import CategoriesPage from '../pages/admin/CategoriesPage';
import CartPage from '../pages/user/CartPage';
import UsersPage from '../pages/admin/UsersPage';
import AdminOrdersPage from '../pages/admin/OrdersPage'
import WishlistPage from '../pages/user/WishlistPage';
import ReviewsPage from '../pages/user/ReviewsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'auth', element: <AuthPage /> },
            { path: 'catalog', element: <CatalogPage /> },
            { path: 'proizvodi/:productSlug', element: <ProductPage /> },
            {
                path: 'profile',
                element: <ProfilePage />,
                children: [
                    { index: true, element: <EditProfilePage /> },
                    { path: 'orders', element: <OrdersPage /> },
                    { path: 'reviews', element: <ReviewsPage /> },
                ],
            },
            { path: 'cart', element: <CartPage /> },
            { path: 'wishlist', element: <WishlistPage /> },
        ],
    },
    {
        path: '/admin',
        element: <ProtectedRoute requiredRole={Role.Employee} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: 'dashboard', element: <DashboardPage /> },
                    { path: 'products', element: <ProductsPage /> },
                    { path: 'products/new', element: <AdminProductPage /> },
                    { path: 'products/:productId', element: <AdminProductPage /> },
                    { path: 'coupons', element: <CouponsPage /> },
                    { path: 'brands', element: <BrandsPage /> },
                    { path: 'categories', element: <CategoriesPage /> },
                    { path: 'orders', element: <AdminOrdersPage /> },
                    { path: 'users', element: <UsersPage /> },
                ],
            },
        ],
    },
]);
