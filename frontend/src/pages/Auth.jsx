import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthProvider'
import { Button } from '@/components/ui/button'

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-card/80 backdrop-blur-md shadow-xl rounded-2xl border border-border overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <span className="font-bold text-xl">E</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">ENSAM360</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === 'signin' ? 'Welcome back. Please sign in.' :
                mode === 'otp' ? `Enter the code sent to ${form.email}` :
                  'Create your account to get started.'}
            </p>
          </div>

          {/* Tabs (Hidden during OTP Verification) */}
          {mode !== 'otp' && (
            <div className="px-8 mt-2">
              <div className="grid grid-cols-2 bg-muted rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(''); }}
                  className={`py-2 text-sm font-medium rounded-md transition-all duration-200 ${mode === 'signin' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  className={`py-2 text-sm font-medium rounded-md transition-all duration-200 ${mode === 'signup' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Sign up
                </button>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mx-8 mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg relative text-sm text-center font-medium animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 space-y-4">

            {/* --- OTP MODE --- */}
            {mode === 'otp' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 text-center">Verification Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background p-3 text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-ring focus:border-input outline-none transition-all"
                    placeholder="123456"
                    maxLength={6}
                    autoFocus
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                  >
                    Cancel Verification
                  </button>
                </div>
              </div>
            ) : (
              /* --- STANDARD MODES (Signin / Signup) --- */
              <>
                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">First name</label>
                      <input
                        name="firstName"
                        type="text"
                        required
                        value={form.firstName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:border-input outline-none transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Last name</label>
                      <input
                        name="lastName"
                        type="text"
                        required
                        value={form.lastName}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:border-input outline-none transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:border-input outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={form.password}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-ring focus:border-input outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-2 shadow-lg shadow-primary/20"
              size="lg"
            >
              {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Verify Account'}
            </Button>

            {/* Footer Links */}
            {mode === 'signin' && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don’t have an account? <button type="button" onClick={() => { setMode('signup'); setError(''); }} className="font-medium text-primary hover:underline transition-all">Sign up</button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account? <button type="button" onClick={() => { setMode('signin'); setError(''); }} className="font-medium text-primary hover:underline transition-all">Sign in</button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Auth