import { NavLink, useNavigate } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { authService } from '../../services/authService'
import { ADMIN_SIDEBAR_ITEMS } from '../../constants/adminSidebarItems'

const AdminSidebar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/auth')
  }

  return (
    <div className="w-62 border-r border-neutral-300 bg-white flex flex-col min-h-screen justify-between">
      <div className="flex flex-col">
        <div className="p-8 border-neutral-100">
          <span className="text-lg font-bold tracking-tight text-black">Admin Panel</span>
        </div>

        <nav className="flex-1 px-4 mt-4 flex flex-col gap-2">
          <span className='font-light text-sm mb-2 text-gray-400'>Meni</span>
          {ADMIN_SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-2 rounded-sm text-sm font-semibold duration-50
                ${isActive
                  ? 'bg-neutral-100 border-l-2 border-l-amber-500 text-black'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'}
              `}
            >
              {({ isActive }) => (
                <>
                  <span>
                    {item.icon(isActive)}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
        >
          <FiLogOut className="text-xl" />
          Odjavi se
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
