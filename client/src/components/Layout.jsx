import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './navbar'
import DriverNavbar from './DriverNavbar'
import AdminNavbar from './AdminNavbar'

const Layout = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (_) {}
    }
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user')
      setUser(userData ? JSON.parse(userData) : null)
    }
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userLogin', handleStorageChange)
    window.addEventListener('userLogout', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userLogin', handleStorageChange)
      window.removeEventListener('userLogout', handleStorageChange)
    }
  }, [])

  const isDriver = user?.role === 'driver'
  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-slate-950" style={{ minHeight: '100vh', backgroundColor: '#020617' }}>
      {isAdmin ? <AdminNavbar /> : isDriver ? <DriverNavbar /> : <Navbar />}
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ paddingTop: '5rem' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
