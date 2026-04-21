import React from 'react'

const AdminHeader = () => {
  return (
    <div className='py-4 px-8 flex items-center justify-between border-b-1 border-gray-300'>
        <h1 className='text-2xl'>Dashboard</h1>

        <div className='flex items-center gap-4'>
            <div className='h-10 w-10 rounded-full bg-amber-300'></div>
            <div className='flex flex-col'>
                <span className=''>Marko Isajlovic</span>
                <span className='text-xs text-gray-400'>markoisajlovic@gmail.com</span>
            </div>
        </div>
    </div>
  )
}

export default AdminHeader