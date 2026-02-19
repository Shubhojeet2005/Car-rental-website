import React from 'react'
import { useState } from 'react'
const About = () => {
  const [name, setName] = useState('')
  const [review, setReview] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    review: '',
    email: ''
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const handleSubmit = async (e) => { 
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/about`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
    } catch (error) {
      console.log(error)
    }
    
  }
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">About</h1>
      <p className="text-slate-400">Jeet Car Rental is a car rental company that provides a wide range of cars for rent.</p>
      <p className="text-slate-400">We are a team of car rental experts who are dedicated to providing the best car rental experience to our customers.</p>
      <p className="text-slate-400">We are a team of car rental experts who are dedicated to providing the best car rental experience to our customers.</p>
      <p className="text-slate-400">We are a team of car rental experts who are dedicated to providing the best car rental experience to our customers.</p>
<div className='flex flex-col items-center justify-center'>
  <label htmlFor="name" className='text-slate-400'>Ask for review</label>
  <input type="text" placeholder='Enter your name' name='name' className='w-full p-2 rounded-md border border-gray-300' ></input>
  <button className='bg-blue-500 text-white p-2 rounded-md' onClick={handleSubmit}>Submit</button>
</div>
    </div>
    
  )
}

export default About
