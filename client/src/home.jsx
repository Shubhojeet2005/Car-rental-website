import React from 'react'
import Navbar from './components/navbar'
const home = () => {
  return (
    <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Page content goes here */}
        </main>
    </div>
  )
}

export default home
