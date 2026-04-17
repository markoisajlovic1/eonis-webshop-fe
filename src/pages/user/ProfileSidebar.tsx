import { NavLink } from 'react-router-dom'
import { FiLogOut } from "react-icons/fi";
import { SIDEBAR_ITEMS } from '../../constants/profileSidebarItems';

const ProfileSidebar = () => {
  return (
    <div className="w-80 border-r border-neutral-100 bg-white flex flex-col min-h-[calc(100vh-80px)] justify-between">
      

      <div className='flex flex-col'>
        <div className="p-8 border-b border-neutral-50 mb-4">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Moj nalog</h2>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-2">
            {SIDEBAR_ITEMS.map((item) => (
            <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300
                ${isActive 
                    ? 'text-black font-semibold translate-x-1' 
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-black hover:pl-6'}
                `}
            >
                {item.icon}
                {item.label}
            </NavLink>
            ))}
        </nav>
      </div>

      <div className="p-6 mt-auto">
        <button className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all cursor-pointer">
          <FiLogOut className="text-xl" />
          Odjavi se
        </button>
      </div>
    </div>
  )
}

export default ProfileSidebar;