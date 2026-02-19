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
import DriverRegister from './pages/driver/DriverRegister'
import DriverLogin from './pages/driver/DriverLogin'
import DriverCarDetails from './pages/driver/DriverCarDetails'
import DriverCarPage from './pages/DriverCarPage'

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
          <Route path="driver-register" element={<DriverRegister/>}/>
          <Route path="driver-login" element={<DriverLogin/>}/>
          <Route path="driver-car-details" element={<DriverCarDetails/>}/>
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="car/:id" element={<CarDetails />} />
          <Route path='drivercarpage' element={<DriverCarPage/>}></Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
