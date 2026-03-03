import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './navbar'
import DriverNavbar from './DriverNavbar'
import AdminNavbar from './AdminNavbar'
import socket from '../socket'

const Layout = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        setUser(parsed)
        // register socket room for customer if applicable
        if (parsed?.role === 'customer' && parsed?.email) {
          try { socket.emit('registerCustomer', parsed.email); } catch (e) {}
        }
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

  const location = useLocation()
  // pages that should span the full viewport instead of being constrained
  const authPaths = ['/login','/register','/driver-login','/driver-register','/admin/login','/admin/register']
  const isAuthPage = authPaths.includes(location.pathname)
  const navigate = useNavigate()

  // Listen for tripAccepted on customer sockets and navigate to live tracking
  useEffect(() => {
    const handleTripAccepted = (data) => {
      if (data && data.tripId) {
        // notify and navigate
        try { alert(data.message || 'Your trip was accepted by a driver'); } catch (e) {}
        navigate(`/live-tracking?tripId=${data.tripId}`);
      }
    };
    socket.on('tripAccepted', handleTripAccepted);
    return () => socket.off('tripAccepted', handleTripAccepted);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950" style={{ minHeight: '100vh', backgroundColor: '#020617' }}>
      {isAdmin ? <AdminNavbar /> : isDriver ? <DriverNavbar /> : <Navbar />}
      <main
        className={`pt-20 px-4 sm:px-6 lg:px-8 ${isAuthPage ? '' : 'max-w-7xl mx-auto'}`}
        style={{ paddingTop: '5rem' }}
      >
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
