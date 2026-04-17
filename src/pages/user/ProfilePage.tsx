import { Outlet } from 'react-router-dom'
import ProfileSidebar from './ProfileSidebar'

const ProfilePage = () => {
  return (
    // min-h is calculated as 100vh minus the height of the header (approx 80px)
    <div className="flex min-h-[calc(100vh-80px)] bg-white overflow-hidden">
        <ProfileSidebar />
        <div className="flex-1 bg-neutral-50/50">
            <Outlet />
        </div>
    </div>
  )
}

export default ProfilePage;