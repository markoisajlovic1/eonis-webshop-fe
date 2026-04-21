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
import CouponsPage from '../pages/admin/CouponsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'auth', element: <AuthPage /> },
            { path: ':categorySlug', element: <CatalogPage /> },
            {
                path: 'profile',
                element: <ProfilePage />,
                children: [
                    { index: true, element: <EditProfilePage /> },
                    { path: 'orders', element: <OrdersPage /> },
                ],
            },
        ],
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'coupons', element: <CouponsPage /> },
        ],
    },
]);
