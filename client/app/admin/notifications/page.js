"use client"
import { useState, useEffect } from "react"
import {
  Bell,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle,
  Send,
  Clock,
  X,
  Sparkles,
  Zap,
  TrendingUp,
  Search,
  Brain,
  Menu,
  Moon,
  Sun,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "/components/ui/avatar"
import { Button } from "/components/ui/button"

export default function AdminNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState("info")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("studyhub_token")
    if (!token) {
      router.push("/login")
      return
    }
    fetchNotifications()
  }, [router])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("studyhub_token")
      if (!token) {
        router.push("/login")
        return
      }

      // const res = await fetch("http://localhost:5000/api/notifications", {
      const res = await fetch("https://edu-hub-v1.vercel.app/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("studyhub_token")
          router.push("/login")
          return
        }
        throw new Error("Failed to fetch notifications")
      }

      const data = await res.json()
      setNotifications(data)
      setError("")
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Failed to load notifications. Please try again.")
    }
  }

  const showMessage = (text, isError = false) => {
    if (isError) {
      setError(text)
      setTimeout(() => setError(""), 5000)
    } else {
      setSuccess(text)
      setTimeout(() => setSuccess(""), 5000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("studyhub_token")
      if (!token) {
        router.push("/login")
        return
      }

      // const res = await fetch("http://localhost:5000/api/notifications", {
      const res = await fetch("https://edu-hub-v1.vercel.app/api/notifications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ title, message, type }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("studyhub_token")
          router.push("/login")
          return
        }
        throw new Error("Failed to create notification")
      }

      const data = await res.json()
      setTitle("")
      setMessage("")
      setType("info")
      await fetchNotifications()
      showMessage("Notification sent successfully! 🎉")
    } catch (error) {
      console.error("Error creating notification:", error)
      showMessage("Failed to create notification. Please try again.", true)
    }

    setLoading(false)
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("studyhub_token")
      if (!token) {
        router.push("/login")
        return
      }

      // const res = await fetch(`http://localhost:5000/api/notifications/${id}`, {
      const res = await fetch(`https://edu-hub-v1.vercel.app/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("studyhub_token")
          router.push("/login")
          return
        }
        throw new Error("Failed to delete notification")
      }

      await fetchNotifications()
      showMessage("Notification deleted successfully!")
    } catch (error) {
      console.error("Error deleting notification:", error)
      showMessage("Failed to delete notification. Please try again.", true)
    }
  }

  const getTypeIcon = (notificationType) => {
    const icons = {
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      error: <AlertCircle className="h-5 w-5 text-red-500" />,
      info: <Info className="h-5 w-5 text-blue-500" />,
    }
    return icons[notificationType] || <Info className="h-5 w-5 text-blue-500" />
  }

  const getTypeColor = (notificationType) => {
    const colors = {
      success: "from-green-500 to-green-600",
      warning: "from-yellow-500 to-yellow-600",
      error: "from-red-500 to-red-600",
      info: "from-blue-500 to-blue-600",
    }
    return colors[notificationType] || "from-blue-500 to-blue-600"
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType = filterType === "all" || notification.type === filterType
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">EduHub</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle */}
              <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="focus:outline-none">
                {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
              </Button>

              {/* Admin Profile */}
              <a href="/admin/upload" target="_blank">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 border border-gray-200 dark:border-gray-700">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold">
                    A
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">ADMIN</span>
              </div>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold">
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">ADMIN</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                  </div>
                </div>
                <Button variant="ghost" className="justify-start" onClick={toggleDarkMode}>
                  {darkMode ? <Sun className="mr-2 h-4 w-4 text-yellow-400" /> : <Moon className="mr-2 h-4 w-4" />}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Notification Center
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Send notifications and announcements to all students
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border-l-4 bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300 flex items-center gap-3 animate-in slide-in-from-top duration-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl border-l-4 bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300 flex items-center gap-3 animate-in slide-in-from-top duration-300">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Notification Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Create New Notification
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Notification Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Notification Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "info", label: "Info", icon: Info },
                    { value: "success", label: "Success", icon: CheckCircle },
                    { value: "warning", label: "Warning", icon: AlertCircle },
                    { value: "error", label: "Error", icon: AlertCircle },
                  ].map((notificationType) => (
                    <button
                      key={notificationType.value}
                      type="button"
                      onClick={() => setType(notificationType.value)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        type === notificationType.value
                          ? `border-${notificationType.value === "warning" ? "yellow" : notificationType.value === "error" ? "red" : notificationType.value === "success" ? "green" : "blue"}-500 bg-gradient-to-r ${getTypeColor(notificationType.value)} text-white shadow-lg transform scale-105`
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <notificationType.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{notificationType.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                  placeholder="Enter notification title"
                  required
                />
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-gray-500 resize-none"
                  rows="4"
                  placeholder="Enter your message here..."
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">{message.length}/500 characters</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-3 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Notification
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Notifications List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Recent Notifications
                </h2>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications found</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                    {searchTerm || filterType !== "all"
                      ? "Try adjusting your search or filter"
                      : "Create your first notification above"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          {getTypeIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <p className="text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  notification.type === "success"
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                    : notification.type === "warning"
                                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                      : notification.type === "error"
                                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                }`}
                              >
                                {notification.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-100 dark:bg-gray-800 py-4 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} EduHub. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
