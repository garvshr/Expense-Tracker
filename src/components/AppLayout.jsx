import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-x-hidden min-w-0">
        <div className="p-6 pt-16 lg:pt-10 lg:p-10 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
