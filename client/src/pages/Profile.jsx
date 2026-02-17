import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:3000'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    
    const userObj = JSON.parse(userData)
    setUser(userObj)
    setLoading(false)
    
    // Fetch latest user data
    fetchUserProfile(userObj.id)
  }, [navigate])

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
        window.dispatchEvent(new Event('userLogin'))
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setError('')
    setSuccess('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('profilePicture', file)

      const res = await fetch(`${API_URL}/user/profile/${user.id}/picture`, {
        method: 'PUT',
        body: formData
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Failed to upload image')
        return
      }

      setSuccess('Profile picture updated successfully!')
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('userLogin'))
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-400 rounded-2xl rotate-12 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                <svg className="w-10 h-10 text-white -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Your Profile</h1>
            <p className="text-slate-400 font-medium">Manage your account settings</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 text-center">
              Profile Picture
            </label>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {user.profilePicture ? (
                  <img 
                    src={`${API_URL}${user.profilePicture}`} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500/50 shadow-xl shadow-indigo-500/20"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-indigo-500/20 border-4 border-indigo-500/50">
                    {user.firstname?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 border-2 border-slate-900">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <label className="cursor-pointer">
                <div className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2">
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {user.profilePicture ? 'Change Picture' : 'Upload Picture'}
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-slate-500 text-center">JPG, PNG or GIF. Max size 5MB</p>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">First Name</label>
              <div className="w-full bg-white/[0.03] border border-white/10 text-white text-sm rounded-2xl px-5 py-4">
                {user.firstname}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Last Name</label>
              <div className="w-full bg-white/[0.03] border border-white/10 text-white text-sm rounded-2xl px-5 py-4">
                {user.lastname}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
              <div className="w-full bg-white/[0.03] border border-white/10 text-white text-sm rounded-2xl px-5 py-4">
                {user.email}
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
