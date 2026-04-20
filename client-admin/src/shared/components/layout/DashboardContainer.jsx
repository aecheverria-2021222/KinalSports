import { Navbar } from './Navbar.jsx'
import { Sidebar } from './Sidebar.jsx'

export const DashboardContainer = ({user, onLogout, children}) => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
        <Navbar user={user} onLogout={onLogout}/>
        
        <div className='flex flex-1'>
            <Sidebar/>

            <main className='flex-1 p-6'>
                {children}
            </main>
        </div>
    </div>
  )
}