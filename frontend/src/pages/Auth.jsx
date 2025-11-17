import { useState } from 'react'

function Auth() {
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder submit - integrate with backend later
    // eslint-disable-next-line no-console
    console.log(`${mode === 'signin' ? 'Sign in' : 'Sign up'} request`, form)
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
              {mode === 'signin' ? 'Welcome back. Please sign in to continue.' : 'Create your account to get started.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="px-8">
            <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === 'signin' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === 'signup' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign up
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8">
            {mode === 'signup' && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 outline-none bg-white"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 outline-none bg-white"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                {mode === 'signin' && (
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-700">Forgot password?</a>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 pr-10 outline-none bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {mode === 'signin' && (
              <div className="flex items-center justify-between mb-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  Remember me
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: '#213985' }}
            >
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-500">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={() => alert('Social login placeholder')}
              className="w-full py-2.5 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
            >
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-gray-600">
              {mode === 'signin' ? (
                <>Don’t have an account? <button type="button" onClick={() => setMode('signup')} className="font-medium text-blue-600 hover:text-blue-700">Sign up</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => setMode('signin')} className="font-medium text-blue-600 hover:text-blue-700">Sign in</button></>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Auth


