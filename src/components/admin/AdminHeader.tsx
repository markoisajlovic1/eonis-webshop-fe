import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useLocation } from 'react-router-dom';
import { translateAdminSection } from '../../constants/adminHeaderTranslations';
import { getAdminSection } from '../../utils/getAdminSection';

const AdminHeader = () => {
  const { username, email } = useSelector((state: RootState) => state.auth);
  // const navigation = useNavigate()
  const location = useLocation();

  const sectionKey = getAdminSection(location.pathname);
  const title = translateAdminSection(sectionKey);

  return (
    <div className='py-4 px-8 flex items-center justify-between border-b border-gray-200 bg-white'>
        <h1 className='text-2xl'>{title}</h1>

        <div className='flex items-center gap-4'>
            <div className='h-10 w-10 rounded-full bg-amber-300'></div>
            <div className='flex flex-col'>
                <span>{username}</span>
                <span className='text-xs text-gray-400'>{email}</span>
            </div>
        </div>
    </div>
  )
}

export default AdminHeader