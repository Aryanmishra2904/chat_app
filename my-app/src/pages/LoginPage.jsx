import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const login = useAuthStore((state) => state.login)
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn)

  const handleSubmit = async (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white">Welcome Back</h1>
        <p className="mt-2 text-white/80">Sign in to your account</p>
      </div>

      {/* Form */}
      <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="relative">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-white/70" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full pl-10 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/70 focus:border-transparent"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-white/70" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="w-full pl-10 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/70 focus:border-transparent"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-white/70" />
            ) : (
              <Eye className="h-5 w-5 text-white/70" />
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-white/40 disabled:opacity-50 transition-colors"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Signup link */}
      <p className="mt-6 text-center text-white/80">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-medium underline hover:text-white">
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default LoginPage