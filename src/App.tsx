import './App.css'
import Header from './components/user/Header'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className='min-h-screen bg-neutral-50 flex flex-col'>
      <Header />
      <main className='flex-1 flex flex-col'>
        <Outlet />
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}

export default App
