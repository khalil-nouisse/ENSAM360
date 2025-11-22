import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthProvider'

function Auth() {
  const { login, register, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  // Modes: 'signin', 'signup', 'otp'
  const [mode, setMode] = useState('signin') 
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [otp, setOtp] = useState('') 
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('');

    try {
      if (mode === 'signin') {
        // 1. LOGIN
        await login(form.email, form.password);
        navigate('/'); 
      } else if (mode === 'signup') {
        // 2. REGISTER -> Switch to OTP
        await register(form.firstName, form.lastName, form.email, form.password);
        alert("Account created successfully! Please check your email for the verification code.");
        setMode('otp'); 
      } else if (mode === 'otp') {
        // 3. VERIFY -> Switch to Signin
        await verifyOtp(form.email, otp);
        alert("Account Verified Successfully! Please sign in.");
        setMode('signin');
        setForm(prev => ({ ...prev, password: '' })); // Clear password for security
      }
    } catch (err) {
      console.error("Auth Error:", err);
      if (!err?.response) {
        setError('No Server Response. Is the backend running?');
      } else {
        setError(err.response?.data?.message || 'Authentication Failed');
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh)] flex items-center justify-center px-4" style={{ backgroundColor: '#F1E8DD' }}>
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-darkblue/10 overflow-hidden">
          
          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl" style={{ backgroundColor: '#213985' }}>
              <span className="text-white font-bold">E</span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-gray-900">ENSAM360</h1>
            <p className="mt-1 text-sm text-gray-500">
              {mode === 'signin' ? 'Welcome back. Please sign in.' : 
               mode === 'otp' ? `Enter the code sent to ${form.email}` :
               'Create your account to get started.'}
            </p>
          </div>

          {/* Tabs (Hidden during OTP Verification) */}
          {mode !== 'otp' && (
            <div className="px-8">
              <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(''); }}
                  className={`py-2 text-sm font-medium rounded-md transition-colors ${
                    mode === 'signin' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  className={`py-2 text-sm font-medium rounded-md transition-colors ${
                    mode === 'signup' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign up
                </button>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mx-8 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8">
            
            {/* --- OTP MODE --- */}
            {mode === 'otp' ? (
               <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Verification Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="123456"
                    maxLength={6}
                    autoFocus
                    required
                  />
                  <div className="mt-4 flex justify-center">
                    <button 
                        type="button" 
                        onClick={() => setMode('signin')}
                        className="text-sm text-gray-500 hover:text-gray-800 underline"
                    >
                        Cancel Verification
                    </button>
                  </div>
               </div>
            ) : (
                /* --- STANDARD MODES (Signin / Signup) --- */
                <>
                    {mode === 'signup' && (
                    <>
                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                        <input
                            name="firstName"
                            type="text"
                            required
                            value={form.firstName}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 px-3 py-2 outline-none"
                            placeholder="John"
                        />
                        </div>

                        <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                        <input
                            name="lastName"
                            type="text"
                            required
                            value={form.lastName}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 px-3 py-2 outline-none"
                            placeholder="Doe"
                        />
                        </div>
                    </>
                    )}

                    <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 px-3 py-2 outline-none"
                        placeholder="you@example.com"
                    />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 px-3 py-2 pr-10 outline-none"
                            placeholder="••••••••"
                            />
                            <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                            >
                            {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: '#213985' }}
            >
              {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Verify Account'}
            </button>

            {/* Footer Links */}
            {mode === 'signin' && (
                <p className="mt-6 text-center text-sm text-gray-600">
                  Don’t have an account? <button type="button" onClick={() => { setMode('signup'); setError(''); }} className="font-medium text-blue-600 hover:text-blue-700">Sign up</button>
                </p>
            )}
             {mode === 'signup' && (
                <p className="mt-6 text-center text-sm text-gray-600">
                  Already have an account? <button type="button" onClick={() => { setMode('signin'); setError(''); }} className="font-medium text-blue-600 hover:text-blue-700">Sign in</button>
                </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Auth