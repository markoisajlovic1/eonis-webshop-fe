import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      
      <main className="flex-1">
        <AdminHeader />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
