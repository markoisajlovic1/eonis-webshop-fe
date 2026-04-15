import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/user/HomePage';
import AuthPage from '../pages/shared/AuthPage';
import CatalogPage from '../pages/user/CatalogPage';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'auth', element: <AuthPage /> },
            { path: ':categorySlug', element: <CatalogPage /> },
        ]
    }
]);