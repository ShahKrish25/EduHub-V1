// "use client"
// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import {
//   Eye,
//   EyeOff,
//   Mail,
//   Lock,
//   ArrowRight,
//   Sparkles,
//   BookOpen,
//   Users,
//   Award,
//   TrendingUp,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   Brain,
//   GraduationCap,
//   Star,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [message, setMessage] = useState("")
//   const [messageType, setMessageType] = useState("error")
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   // Check for existing token and redirect on mount
//   useEffect(() => {
//     const token = localStorage.getItem("studyhub_token");
//     if (token) {
//       // You might want to verify the token validity here with a backend call
//       // but for a quick check, redirecting based on token presence is enough
//       // if the token is invalid, the student page will handle the redirect back to login
//       router.push("/student/resources");
//     }
//   }, [router]); // Dependency array includes router

//   // Animated stats for the hero section
//   const [stats, setStats] = useState({
//     students: 0,
//     resources: 0,
//     subjects: 0,
//     satisfaction: 0,
//   })

//   useEffect(() => {
//     // Animate stats on load
//     const targetStats = { students: 10000, resources: 5000, subjects: 120, satisfaction: 98 }
//     const duration = 2000
//     const steps = 60
//     const stepDuration = duration / steps

//     let currentStep = 0
//     const interval = setInterval(() => {
//       currentStep++
//       const progress = currentStep / steps

//       setStats({
//         students: Math.floor(targetStats.students * progress),
//         resources: Math.floor(targetStats.resources * progress),
//         subjects: Math.floor(targetStats.subjects * progress),
//         satisfaction: Math.floor(targetStats.satisfaction * progress),
//       })

//       if (currentStep >= steps) {
//         clearInterval(interval)
//         setStats(targetStats)
//       }
//     }, stepDuration)

//     return () => clearInterval(interval)
//   }, [])

//   const handleLogin = async (e) => {
//     const token =  localStorage.getItem("studyhub_token");
//     if(token){
//       window.location.href = "/student/resources"
//       return
//     }
//     e.preventDefault()
//     setIsLoading(true)
//     setMessage("")

//     if (!email || !password) {
//       setMessage("Please fill in all fields.")
//       setMessageType("error")
//       setIsLoading(false)
//       return
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       })

//       const data = await res.json()

//       if (res.ok) {
//         localStorage.setItem("studyhub_token", data.token)
//         setMessage("Login successful! Redirecting...")
//         setMessageType("success")

//         setTimeout(() => {
//           if (data.user?.role === "admin") {
//             router.push("/admin/upload")
//           } else {
//             router.push("/student/resources")
//           }
//         }, 1000)
//       } else {
//         setMessage(data.message || "Login failed.")
//         setMessageType("error")
//       }
//     } catch (err) {
//       setMessage("Something went wrong. Please try again.")
//       setMessageType("error")
//     }

//     setIsLoading(false)
//   }

//   const FloatingElement = ({ children, delay = 0, className = "" }) => (
//     <div
//       className={`animate-bounce ${className}`}
//       style={{
//         animationDelay: `${delay}s`,
//         animationDuration: "3s",
//         animationIterationCount: "infinite",
//       }}
//     >
//       {children}
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
//       {/* Left Side - Hero Section */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
//         {/* Animated Background Elements */}
//         <div className="absolute inset-0">
//           {/* Floating geometric shapes */}
//           <FloatingElement delay={0} className="absolute top-20 left-20">
//             <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"></div>
//           </FloatingElement>
//           <FloatingElement delay={1} className="absolute top-40 right-32">
//             <div className="w-12 h-12 bg-yellow-400/20 rounded-lg rotate-45 backdrop-blur-sm"></div>
//           </FloatingElement>
//           <FloatingElement delay={2} className="absolute bottom-40 left-32">
//             <div className="w-20 h-20 bg-pink-400/15 rounded-full backdrop-blur-sm"></div>
//           </FloatingElement>
//           <FloatingElement delay={0.5} className="absolute bottom-20 right-20">
//             <div className="w-14 h-14 bg-green-400/20 rounded-lg backdrop-blur-sm"></div>
//           </FloatingElement>

//           {/* Animated icons */}
//           <FloatingElement delay={1.5} className="absolute top-32 right-16">
//             <BookOpen className="w-8 h-8 text-white/30" />
//           </FloatingElement>
//           <FloatingElement delay={2.5} className="absolute bottom-32 left-16">
//             <GraduationCap className="w-10 h-10 text-white/30" />
//           </FloatingElement>
//           <FloatingElement delay={3} className="absolute top-1/2 left-1/4">
//             <Star className="w-6 h-6 text-yellow-300/40" />
//           </FloatingElement>
//         </div>

//         {/* Content */}
//         <div className="relative z-10 flex flex-col justify-center px-12 text-white">
//           <div className="mb-8">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
//                 <Brain className="h-10 w-10 text-white" />
//               </div>
//               <h1 className="text-4xl font-bold">EduHub</h1>
//             </div>
//             <h2 className="text-3xl font-bold mb-4 leading-tight">
//               Welcome Back to Your
//               <span className="block text-yellow-300">Learning Journey</span>
//             </h2>
//             <p className="text-xl text-blue-100 mb-8">
//               Access thousands of curated resources, connect with fellow students, and excel in your academic pursuits.
//             </p>
//           </div>

//           {/* Animated Stats */}
//           <div className="grid grid-cols-2 gap-6 mb-8">
//             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
//               <div className="flex items-center gap-3 mb-2">
//                 <Users className="h-6 w-6 text-blue-200" />
//                 <span className="text-2xl font-bold">{stats.students.toLocaleString()}+</span>
//               </div>
//               <p className="text-blue-100 text-sm">Active Students</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
//               <div className="flex items-center gap-3 mb-2">
//                 <BookOpen className="h-6 w-6 text-green-200" />
//                 <span className="text-2xl font-bold">{stats.resources.toLocaleString()}+</span>
//               </div>
//               <p className="text-blue-100 text-sm">Resources</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
//               <div className="flex items-center gap-3 mb-2">
//                 <Award className="h-6 w-6 text-yellow-200" />
//                 <span className="text-2xl font-bold">{stats.subjects}+</span>
//               </div>
//               <p className="text-blue-100 text-sm">Subjects</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
//               <div className="flex items-center gap-3 mb-2">
//                 <TrendingUp className="h-6 w-6 text-purple-200" />
//                 <span className="text-2xl font-bold">{stats.satisfaction}%</span>
//               </div>
//               <p className="text-blue-100 text-sm">Satisfaction</p>
//             </div>
//           </div>

//           {/* Features */}
//           <div className="space-y-3">
//             <div className="flex items-center gap-3">
//               <CheckCircle className="h-5 w-5 text-green-300" />
//               <span className="text-blue-100">Access to premium study materials</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <CheckCircle className="h-5 w-5 text-green-300" />
//               <span className="text-blue-100">Real-time notifications and updates</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <CheckCircle className="h-5 w-5 text-green-300" />
//               <span className="text-blue-100">Collaborative learning environment</span>
//             </div>
//           </div>
//         </div>

//         {/* Animated gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 animate-pulse"></div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           {/* Mobile Logo */}
//           <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
//             <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
//               <Brain className="h-8 w-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               EduHub
//             </h1>
//           </div>

//           <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
//             <CardHeader className="space-y-1 pb-6">
//               <CardTitle className="text-3xl font-bold text-center text-gray-900">Welcome Back</CardTitle>
//               <p className="text-center text-gray-600">Sign in to your account to continue learning</p>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Message Alert */}
//               {message && (
//                 <div
//                   className={`p-4 rounded-xl border-l-4 flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
//                     messageType === "success"
//                       ? "bg-green-50 border-green-500 text-green-700"
//                       : "bg-red-50 border-red-500 text-red-700"
//                   }`}
//                 >
//                   {messageType === "success" ? (
//                     <CheckCircle className="h-5 w-5 flex-shrink-0" />
//                   ) : (
//                     <AlertCircle className="h-5 w-5 flex-shrink-0" />
//                   )}
//                   <span className="text-sm font-medium">{message}</span>
//                 </div>
//               )}

//               <form onSubmit={handleLogin} className="space-y-6">
//                 {/* Email Field */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Email Address</label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <input
//                       type="email"
//                       placeholder="Enter your email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white/70"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Password Field */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Password</label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter your password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white/70"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Forgot Password */}
//                 <div className="flex justify-end">
//                   <Link
//                     href="#"
//                     className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
//                   >
//                     Forgot your password?
//                   </Link>
//                 </div>

//                 {/* Login Button */}
//                 <Button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                       Signing In...
//                     </>
//                   ) : (
//                     <>
//                       Sign In
//                       <ArrowRight className="ml-2 h-5 w-5" />
//                     </>
//                   )}
//                 </Button>
//               </form>

//               {/* Divider */}
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-200"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-white text-gray-500">New to EduHub?</span>
//                 </div>
//               </div>

//               {/* Sign Up Link */}
//               <div className="text-center">
//                 <Link
//                   href="/register"
//                   className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
//                 >
//                   Create your account
//                   <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Footer */}
//           <div className="mt-8 text-center text-sm text-gray-500">
//             <p>© 2024 EduHub. All rights reserved.</p>
//             <div className="flex justify-center gap-4 mt-2">
//               <Link href="#" className="hover:text-gray-700 transition-colors">
//                 Privacy Policy
//               </Link>
//               <Link href="#" className="hover:text-gray-700 transition-colors">
//                 Terms of Service
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



// claude
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  GraduationCap,
  Star,
} from "lucide-react"
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("error")
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false) // Track if we're on client side
  const [isCheckingAuth, setIsCheckingAuth] = useState(true) // Track auth check status
  
  // Move these useState calls before any conditional logic to maintain hooks order
  const finalStats = { students: 10000, resources: 5000, subjects: 120, satisfaction: 98 }
  const [stats, setStats] = useState(finalStats) // Start with final values
  const [shouldAnimate, setShouldAnimate] = useState(false)
  
  const router = useRouter()

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check for existing token and redirect - only run on client after hydration
  useEffect(() => {
    if (!isClient) return // Don't run on server
    
    // Use a small delay to ensure hydration is complete
    const checkToken = () => {
      const token = localStorage.getItem("studyhub_token");
      if (token) {
        router.push("/student/resources");
      } else {
        setIsCheckingAuth(false); // Only show login form if no token
      }
    };
    
    // Defer the redirect to avoid hydration mismatch
    const timeoutId = setTimeout(checkToken, 100);
    return () => clearTimeout(timeoutId);
  }, [router, isClient])

  useEffect(() => {
    if (!isClient) return // Don't animate on server
    
    // Reset to 0 and then animate only on client
    setStats({ students: 0, resources: 0, subjects: 0, satisfaction: 0 })
    setShouldAnimate(true)
    
    // Small delay to ensure the reset happens before animation
    const timer = setTimeout(() => {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setStats({
          students: Math.floor(finalStats.students * progress),
          resources: Math.floor(finalStats.resources * progress),
          subjects: Math.floor(finalStats.subjects * progress),
          satisfaction: Math.floor(finalStats.satisfaction * progress),
        })

        if (currentStep >= steps) {
          clearInterval(interval)
          setStats(finalStats)
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }, 100)

    return () => clearTimeout(timer)
  }, [isClient])

  // Show loading screen while checking authentication
  if (!isClient || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 inline-block">
            <Brain className="h-12 w-12 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            EduHub
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    // Only check localStorage on client side after hydration
    if (isClient) {
      const token = localStorage.getItem("studyhub_token");
      if (token) {
        router.push("/student/resources");
        return
      }
    }
    
    setIsLoading(true)
    setMessage("")

    if (!email || !password) {
      setMessage("Please fill in all fields.")
      setMessageType("error")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        if (isClient) {
          localStorage.setItem("studyhub_token", data.token)
        }
        setMessage("Login successful! Redirecting...")
        setMessageType("success")

        setTimeout(() => {
          if (data.user?.role === "admin") {
            router.push("/admin/upload")
          } else {
            router.push("/student/resources")
          }
        }, 1000)
      } else {
        setMessage(data.message || "Login failed.")
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
      className={`${isClient ? 'animate-bounce' : ''} ${className}`}
      style={isClient ? {
        animationDelay: `${delay}s`,
        animationDuration: "3s",
        animationIterationCount: "infinite",
      } : {}}
    >
      {children}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating geometric shapes */}
          <FloatingElement delay={0} className="absolute top-20 left-20">
            <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"></div>
          </FloatingElement>
          <FloatingElement delay={1} className="absolute top-40 right-32">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-lg rotate-45 backdrop-blur-sm"></div>
          </FloatingElement>
          <FloatingElement delay={2} className="absolute bottom-40 left-32">
            <div className="w-20 h-20 bg-pink-400/15 rounded-full backdrop-blur-sm"></div>
          </FloatingElement>
          <FloatingElement delay={0.5} className="absolute bottom-20 right-20">
            <div className="w-14 h-14 bg-green-400/20 rounded-lg backdrop-blur-sm"></div>
          </FloatingElement>

          {/* Animated icons */}
          <FloatingElement delay={1.5} className="absolute top-32 right-16">
            <BookOpen className="w-8 h-8 text-white/30" />
          </FloatingElement>
          <FloatingElement delay={2.5} className="absolute bottom-32 left-16">
            <GraduationCap className="w-10 h-10 text-white/30" />
          </FloatingElement>
          <FloatingElement delay={3} className="absolute top-1/2 left-1/4">
            <Star className="w-6 h-6 text-yellow-300/40" />
          </FloatingElement>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold">EduHub</h1>
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Welcome Back to Your
              <span className="block text-yellow-300">Learning Journey</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Access thousands of curated resources, connect with fellow students, and excel in your academic pursuits.
            </p>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-blue-200" />
                <span className="text-2xl font-bold">{stats.students.toLocaleString()}+</span>
              </div>
              <p className="text-blue-100 text-sm">Active Students</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-6 w-6 text-green-200" />
                <span className="text-2xl font-bold">{stats.resources.toLocaleString()}+</span>
              </div>
              <p className="text-blue-100 text-sm">Resources</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-6 w-6 text-yellow-200" />
                <span className="text-2xl font-bold">{stats.subjects}+</span>
              </div>
              <p className="text-blue-100 text-sm">Subjects</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-purple-200" />
                <span className="text-2xl font-bold">{stats.satisfaction}%</span>
              </div>
              <p className="text-blue-100 text-sm">Satisfaction</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-blue-100">Access to premium study materials</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-blue-100">Real-time notifications and updates</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-blue-100">Collaborative learning environment</span>
            </div>
          </div>
        </div>

        {/* Animated gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 ${isClient ? 'animate-pulse' : ''}`}></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduHub
            </h1>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-3xl font-bold text-center text-gray-900">Welcome Back</CardTitle>
              <p className="text-center text-gray-600">Sign in to your account to continue learning</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Message Alert */}
              {message && (
                <div
                  className={`p-4 rounded-xl border-l-4 flex items-center gap-3 ${isClient ? 'animate-in slide-in-from-top duration-300' : ''} ${
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

              <form onSubmit={handleLogin} className="space-y-6">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white/70"
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white/70"
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

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
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
                  <span className="px-4 bg-white text-gray-500">New to EduHub?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
                >
                  Create your account
                  <Sparkles className={`h-4 w-4 ${isClient ? 'group-hover:animate-pulse' : ''}`} />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2024 EduHub. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="#" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gray-700 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}