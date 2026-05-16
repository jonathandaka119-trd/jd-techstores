import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight, AlertCircle, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { toast } from '../components/ui'

function TechCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    interface Node { x: number; y: number; vx: number; vy: number }
    const nodes: Node[] = Array.from({ length: 42 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(220,38,38,${0.18 * (1 - dist / 130)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      nodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(220,38,38,0.55)'
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

function BrandPanel({ subtitle }: { subtitle: string }) {
  return (
    <div className="hidden md:flex md:w-5/12 relative flex-col items-center justify-center p-10 overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#0a0a0a 60%,#1a0a0a 100%)' }}>
      <TechCanvas />
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="w-10 h-10 bg-primary-500 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <span className="font-display text-4xl tracking-widest text-primary-500">JD</span>
          <span className="font-display text-4xl tracking-widest text-white">TECH</span>
          <div className="text-xs text-gray-500 tracking-[0.4em] uppercase mt-1">STORES</div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="text-gray-400 text-sm mt-4 max-w-xs leading-relaxed"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex gap-6 mt-10 justify-center"
        >
          {[['10k+','Customers'],['500+','Products'],['4.9★','Rating']].map(([v,l]) => (
            <div key={l} className="text-center">
              <p className="text-primary-400 font-bold text-lg">{v}</p>
              <p className="text-gray-600 text-xs">{l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2.5 mb-4">
      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-red-700">{message}</p>
    </div>
  )
}

function GoogleBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {label}
    </button>
  )
}

function Divider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-widest">or</span>
      </div>
    </div>
  )
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{children}</label>
}

export function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPwd, setShowPwd]           = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await signIn(email, password)
      if (err) {
        const msg = err.message || 'Invalid email or password'
        setError(msg)
        toast.error(msg)
      } else {
        toast.success('Welcome back!')
        navigate('/')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl flex bg-white shadow-lg overflow-hidden border border-gray-200"
        style={{ borderRadius: 0 }}
      >
        <BrandPanel subtitle="Premium computer hardware, gaming peripherals, and office equipment." />

                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
            <p className="text-sm text-gray-500">Access your JD TechStores account</p>
          </div>

          <ErrorBanner message={error} />

          <GoogleBtn onClick={signInWithGoogle} label="Continue with Google" />
          <Divider />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30 transition-colors duration-150">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="flex-1 bg-transparent py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none min-w-0" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary-500 hover:underline">Forgot password?</Link>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30 transition-colors duration-150">
                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input id="password" type={showPwd ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Your password" className="flex-1 bg-transparent py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none min-w-0" />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-5 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm rounded-md transition-colors mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Sign In <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{' '}
            <Link to="/register" className="font-semibold text-primary-500 hover:underline">Create one free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function RegisterPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [agreed, setAgreed]       = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const strength = (() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 8)           s++
    if (/[A-Z]/.test(password))         s++
    if (/[0-9]/.test(password))         s++
    if (/[^A-Za-z0-9]/.test(password))  s++
    return s
  })()
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'][strength]
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8)   { setError('Password must be at least 8 characters'); return }
    if (password !== confirm)   { setError('Passwords do not match'); return }
    if (!agreed)                { setError('Please accept the Terms & Conditions'); return }
    setLoading(true)
    try {
      const { error: err } = await signUp(email, password, fullName)
      if (err) {
        const msg = err.message || 'Registration failed'
        setError(msg)
        toast.error(msg)
      } else {
        toast.success('Account created! Check your email to verify.')
        navigate('/login')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl flex bg-white shadow-lg overflow-hidden border border-gray-200"
        style={{ borderRadius: 0 }}
      >
        <BrandPanel subtitle="Join thousands of tech enthusiasts. Get access to exclusive deals and fast delivery." />

        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
            <p className="text-sm text-gray-500">Start shopping in under a minute</p>
          </div>

          <ErrorBanner message={error} />

          <GoogleBtn onClick={signInWithGoogle} label="Sign up with Google" />
          <Divider />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30 transition-colors duration-150">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input id="name" type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="John Doe" className="flex-1 bg-transparent py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none min-w-0" />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30 transition-colors duration-150">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="flex-1 bg-transparent py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none min-w-0" />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30 transition-colors duration-150">
                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input id="password" type={showPwd ? 'text' : 'password'} required minLength={8} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" className="flex-1 bg-transparent py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none min-w-0" />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-1.5">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-sm transition-colors ${i <= strength ? strengthColor : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Strength: <span className="font-semibold">{strengthLabel}</span></p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30 transition-colors duration-150">
                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input id="confirm" type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password" className="flex-1 bg-transparent py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none min-w-0" />
              </div>
              {confirm && password !== confirm && <p className="text-red-500 text-xs mt-1">Passwords don't match</p>}
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5" style={{ accentColor: '#DC2626' }} />
              <span className="text-xs text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-500 hover:underline">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-5 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm rounded-md transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create Account
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-500 hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (err) setError(err.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl flex bg-white shadow-lg overflow-hidden border border-gray-200"
        style={{ borderRadius: 0 }}
      >
        <BrandPanel subtitle="Reset your password and get back to shopping." />

        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-md flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-6">We sent a reset link to <strong>{email}</strong></p>
              <Link to="/login" className="inline-block py-2.5 px-6 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-md transition-colors">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset password</h1>
                <p className="text-sm text-gray-500">We'll send you a secure reset link</p>
              </div>
              <ErrorBanner message={error} />
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30 transition-colors duration-150">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" className="flex-1 bg-transparent py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none min-w-0" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm rounded-md transition-colors">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Reset Link
                </button>
              </form>
              <Link to="/login" className="block text-center text-sm text-gray-500 hover:text-primary-500 mt-5">← Back to Sign In</Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
