import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/user/HomePage';
import AuthPage from '../pages/shared/AuthPage';
import CatalogPage from '../pages/user/CatalogPage';
import ProfilePage from '../pages/user/ProfilePage';
import EditProfilePage from '../pages/user/EditProfilePage';
import OrdersPage from '../pages/user/OrdersPage';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'auth', element: <AuthPage /> },
            { path: ':categorySlug', element: <CatalogPage /> },
            { path: 'profile', element: <ProfilePage />, 
                children: [
                    { index: true, element: <EditProfilePage /> },
                    { path: 'orders', element: <OrdersPage /> },
                ]
            },
        ]
    }
]);