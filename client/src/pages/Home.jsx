import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Cars, { carsData } from './Cars'

const API_URL = 'http://localhost:3000'

const Home = () => {
  const [user, setUser] = useState(null)
  const [driverCars, setDriverCars] = useState([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const userObj = JSON.parse(userData)
      setUser(userObj)
      
      // Fetch latest user data to get updated profile picture
      fetchUserProfile(userObj.id)
    }

    fetchDriverCars()
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/user/profile/${userId}`)
      const data = await res.json()
      if (res.ok && data.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify({
          id: data.user._id,
          email: data.user.email,
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          profilePicture: data.user.profilePicture || ''
        }))
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  const fetchDriverCars = async () => {
    try {
      const res = await fetch(`${API_URL}/user/drivercars`)
      const data = await res.json()
      if (!res.ok) return

      const mapped = (data.cars || []).map((car) => ({
        id: car._id,
        name: car.name,
        image: car.image,
        charges: car.charges ?? 0,
      }))
      setDriverCars(mapped)
    } catch (err) {
      console.error('Error fetching driver cars:', err)
    }
  }

  const allCars = [...driverCars, ...carsData]

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Jeet Car Rentals
          </h1>
          <p className="text-slate-400 text-lg mb-6">
            Your trusted partner for car rentals
          </p>
        </div>
        <div className='cars-info'>
          <Cars cars={allCars} />
        </div>
      </div>
    </div>
  )
}

export default Home
