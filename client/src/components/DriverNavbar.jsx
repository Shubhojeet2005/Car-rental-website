import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../config'

const DriverNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user')
      setUser(userData ? JSON.parse(userData) : null)
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for login/logout
    window.addEventListener('userLogin', handleStorageChange)
    window.addEventListener('userLogout', handleStorageChange)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userLogin', handleStorageChange)
      window.removeEventListener('userLogout', handleStorageChange)
    }
  }, [])

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Trip Notifications', to: '/driver/notifications' },
    { name: 'About', to: '/about' },
  ]

  return (
    <nav 
      className={`navbar-main fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700 shadow-lg' 
          : 'bg-slate-900/95'
      }`}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 50, backgroundColor: '#0f172a' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 navbar-inner">
        <div className="navbar-row flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-500/50 shadow-lg">
              
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Jeet Car Rentals</span>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-desktop-links hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="text-slate-300 hover:text-indigo-400 transition-colors font-medium text-sm"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/driver/notifications"
                  className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-colors font-medium text-sm"
                >
                  {user.profilePicture ? (
                    <img 
                      src={`${API_URL}${user.profilePicture}`} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-xs">
                      {user.firstname?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span>Notifications</span>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('user')
                    window.dispatchEvent(new Event('userLogout'))
                    window.location.href = '/'
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-red-600/20 active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900/95 backdrop-blur-md">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block text-slate-300 hover:text-indigo-400 transition-colors font-medium text-sm py-2"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/driver/notifications"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-colors font-medium text-sm py-2"
                >
                  {user.profilePicture ? (
                    <img 
                      src={`${API_URL}${user.profilePicture}`} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-xs">
                      {user.firstname?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span>Notifications</span>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('user')
                    window.dispatchEvent(new Event('userLogout'))
                    setIsOpen(false)
                    window.location.href = '/'
                  }}
                  className="w-full text-left bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-red-600/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default DriverNavbar;