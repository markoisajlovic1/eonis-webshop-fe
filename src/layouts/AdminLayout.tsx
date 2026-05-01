import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar />
      
      <main className="flex-1 h-screen flex flex-col">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
