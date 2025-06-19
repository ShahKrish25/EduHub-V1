"use client"
import { useState, useEffect } from "react"
import React from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  GraduationCap,
  Star,
  Zap,
  Shield,
  Webhook,
} from "lucide-react"
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"
const dotenv = require('dotenv');
export default function SignupPage() {
  dotenv.config();
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("error")
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()

  // Animated features for the hero section
  const [currentFeature, setCurrentFeature] = useState(0)
  const features = [
    {
      icon: BookOpen,
      title: "Vast Resource Library",
      description: "Access thousands of study materials, notes, and practice questions",
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with peers and learn together in a supportive community",
    },
    {
      icon: Award,
      title: "Track Your Progress",
      description: "Monitor your learning journey with detailed analytics and insights",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security measures",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    if (!username || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.")
      setMessageType("error")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.")
      setMessageType("error")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.")
      setMessageType("error")
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setMessage("Please accept the terms and conditions.")
      setMessageType("error")
      setIsLoading(false)
      return
    }

    try {
      // const res = await fetch("http://localhost:5000/api/auth/register", {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Account created successfully! Please sign in.")
        setMessageType("success")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setMessage(data.message || data.error || "Registration failed.")
        setMessageType("error")
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.")
      setMessageType("error")
    }

    setIsLoading(false)
  }

  const FloatingElement = ({ children, delay = 0, className = "" }) => (
    <div
      className={`animate-bounce ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: "4s",
        animationIterationCount: "infinite",
      }}
    >
      {children}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EduHub
            </h1>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-3xl font-bold text-center text-gray-900">Join EduHub</CardTitle>
              <p className="text-center text-gray-600">Create your account and start your learning journey</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Message Alert */}
              {message && (
                <div
                  className={`p-4 rounded-xl border-l-4 flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
                    messageType === "success"
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "bg-red-50 border-red-500 text-red-700"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{message}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white/70"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white/70"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white/70"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white/70"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-purple-600 hover:text-purple-700 font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-purple-600 hover:text-purple-700 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Signup Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors group"
                >
                  Sign in to your account
                  <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} EduHub. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-700 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating geometric shapes */}
          <FloatingElement delay={0} className="absolute top-20 right-20">
            <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"></div>
          </FloatingElement>
          <FloatingElement delay={1.5} className="absolute top-40 left-32">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-lg rotate-45 backdrop-blur-sm"></div>
          </FloatingElement>
          <FloatingElement delay={2.5} className="absolute bottom-40 right-32">
            <div className="w-20 h-20 bg-pink-400/15 rounded-full backdrop-blur-sm"></div>
          </FloatingElement>
          <FloatingElement delay={1} className="absolute bottom-20 left-20">
            <div className="w-14 h-14 bg-green-400/20 rounded-lg backdrop-blur-sm"></div>
          </FloatingElement>

          {/* Animated icons */}
          <FloatingElement delay={2} className="absolute top-32 left-16">
            <GraduationCap className="w-10 h-10 text-white/30" />
          </FloatingElement>
          <FloatingElement delay={3} className="absolute bottom-32 right-16">
            <Star className="w-8 h-8 text-yellow-300/40" />
          </FloatingElement>
          <FloatingElement delay={0.5} className="absolute top-1/2 right-1/4">
            <Zap className="w-6 h-6 text-blue-300/40" />
          </FloatingElement>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Webhook className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold">EduHub</h1>
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Start Your
              <span className="block text-yellow-300">Academic Excellence</span>
              <span className="block">Journey Today</span>
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of students who are already excelling with our comprehensive learning platform.
            </p>
          </div>

          {/* Animated Feature Showcase */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                {React.createElement(features[currentFeature].icon, {
                  className: "h-8 w-8 text-white",
                })}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{features[currentFeature].title}</h3>
                <p className="text-purple-100">{features[currentFeature].description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentFeature ? "w-8 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-purple-100">Free access to thousands of resources</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-purple-100">Personalized learning recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-purple-100">24/7 community support</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-purple-100">Progress tracking and analytics</span>
            </div>
          </div>
        </div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-purple-600/50 to-blue-600/50 animate-pulse"></div>
      </div>
    </div>
  )
}
