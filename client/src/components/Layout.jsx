import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './navbar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-950" style={{ minHeight: '100vh', backgroundColor: '#020617' }}>
      <Navbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ paddingTop: '5rem' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
