import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Login from './pages/login'
import Register from './pages/register'
import Profile from './pages/Profile'
import CarDetails from './pages/CarDetails'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register/>}/>
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="car/:id" element={<CarDetails />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
