"use client"
import { useState, useEffect } from "react"
import {
  Plus,
  Trash2,
  Save,
  Upload,
  CalendarIcon,
  FileText,
  Video,
  ImageIcon,
  BookOpen,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  Zap,
  Target,
  Brain,
  Menu,
  Moon,
  Sun,
  BellPlus,
  Settings,
  Edit,
  ExternalLink,
  Search,
  BarChart3,
  Users,
  BookOpenCheck,
  FileSpreadsheet,
  LucideUsers,
  Webhook,
} from "lucide-react"
import Footer from "/components/ui/footer"
import { Avatar, AvatarFallback } from "/components/ui/avatar"
import { Button } from "/components/ui/button"
import { Badge } from "/components/ui/badge"
import { useRouter } from "next/navigation"
import Link from "next/link"
const dotenv = require('dotenv');
export default function AdminUploadPage() {
  dotenv.config();
  const [branch, setBranch] = useState("")
  const [semester, setSemester] = useState("")
  const [subject, setSubject] = useState("")
  const [type, setType] = useState("youtube")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState(null)
  const [link, setLink] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")
  const [subjects, setSubjects] = useState([])
  const [timetableFormat, setTimetableFormat] = useState("image")
  const [examRows, setExamRows] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [examInput, setExamInput] = useState({
    day: "",
    date: "",
    startTime: "",
    endTime: "",
    subject: "",
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [manageBranch, setManageBranch] = useState("")
  const [manageSemester, setManageSemester] = useState("")
  const [manageSubject, setManageSubject] = useState("")
  const [manageType, setManageType] = useState("")
  const [manageSubjects, setManageSubjects] = useState([])
  const [resources, setResources] = useState([])
  const [isLoadingResources, setIsLoadingResources] = useState(false)
  const [editResource, setEditResource] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [stats, setStats] = useState({
    totalResources: 0,
    branchStats: {},
    typeStats: {},
    recentUploads: 0
  })
  const [userRole, setUserRole] = useState(null)
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const router = useRouter()

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
    if (branch && semester) {
      // const token = localStorage.getItem("studyhub_token")
      // if (!token) {
        // window.location.href = "/login"
        // return
      // }

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/resources/subjects?branch=${branch}&semester=${semester}`, {
      // fetch(`http://localhost:5000/api/resources/subjects?branch=${branch}&semester=${semester}`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 401) {
              console.log("nathi barabar");
              
              window.location.href = "/login"
              return
            }
            throw new Error("Failed to fetch subjects")
          }
          return res.json()
        })
        .then((data) => setSubjects(data.subjects || []))
        .catch((error) => {
          console.error("Error fetching subjects:", error)
          setSubjects([])
        })
    } else {
      setSubjects([])
    }
  }, [branch, semester])

  // Add new useEffect for managing resources
  useEffect(() => {
    if (manageBranch && manageSemester) {
      // fetch(`http://localhost:5000/api/resources/subjects?branch=${manageBranch}&semester=${manageSemester}`, {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/resources/subjects?branch=${manageBranch}&semester=${manageSemester}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setManageSubjects(data.subjects || []))
        .catch((error) => {
          console.error("Error fetching subjects:", error)
          setManageSubjects([])
        })
    } else {
      setManageSubjects([])
    }
  }, [manageBranch, manageSemester])

  // Add new useEffect for fetching stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // const res = await fetch('http://localhost:5000/api/resources/stats')
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/resources/stats`)
        if (!res.ok) throw new Error('Failed to fetch stats')
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
    checkUserRole()
  }, [message])

  const checkUserRole = async () => {
    setIsAuthenticating(true)
    try {
      const token = localStorage.getItem("studyhub_token")
      if (!token) {
        router.push("/login")
        return
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      if (!res.ok) {
        localStorage.removeItem("studyhub_token")
        router.push("/login")
        return
      }
      const data = await res.json()
      setUserRole(data.role)
    } catch (error) {
      console.error("Error checking user role:", error)
      localStorage.removeItem("studyhub_token")
      router.push("/login")
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // File size check before anything else
    const MAX_FILE_SIZE_MB = 10;
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setMessage("File is too large. Maximum allowed size is 10MB. Compress the file..");
      setMessageType("error");
      return;
    }

    setIsLoading(true)

    // const token = localStorage.getItem("studyhub_token")
    // if (!token) {
    //   window.location.href = "/login"
    //   return
    // }

    

    const formData = new FormData()
    formData.append("branch", branch)
    formData.append("semester", semester)
    formData.append("subject", subject)
    formData.append("type", type)
    formData.append("title", title)
    formData.append("description", description)

    if (type === "timetable") {
      if (timetableFormat === "image") {
        if (file) {
          formData.append("file", file)
        }
      } else {
        const headers = ["Day", "Date", "Start Time", "End Time", "Subject/Exam"]
        const rows = examRows.map((row) => [row.day, row.date, row.startTime, row.endTime, row.subject])
        formData.append("tableData", JSON.stringify({ headers, rows }))
      }
    } else {
      if (file) {
        formData.append("file", file)
      }
      if (link) formData.append("link", link)
    }

    try {
      // const res = await fetch("http://localhost:5000/api/resources/upload", {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/resources/upload`, {
        method: "POST",
        // headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login"
          return
        }
        throw new Error("Upload failed")
      }

      const data = await res.json()
      setMessage("Resource uploaded successfully! 🎉")
      setMessageType("success")

      // Reset form
      setBranch("")
      setSemester("")
      setSubject("")
      setType("youtube")
      setTitle("")
      setDescription("")
      setFile(null)
      setLink("")
      setSubjects([])
      setExamRows([])
      setTimetableFormat("image")
    } catch (error) {
      console.error("Upload error:", error)
      setMessage("Upload failed. Please try again.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeColor = (resourceType) => {
    const colors = {
      youtube: "from-red-500 to-red-600",
      handwritten: "from-orange-500 to-orange-600",
      pdf: "from-green-500 to-green-600",
      pyq: "from-blue-500 to-blue-600",
      solution: "from-purple-500 to-purple-600",
      timetable: "from-pink-500 to-pink-600",
    }
    return colors[resourceType] || "from-gray-500 to-gray-600"
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const addExamRow = () => {
    if (!examInput.day || !examInput.date || !examInput.startTime || !examInput.endTime || !examInput.subject) return
    setExamRows([...examRows, { ...examInput, id: Date.now() }])
    setExamInput({ day: "", date: "", startTime: "", endTime: "", subject: "" })
  }

  const removeExamRow = (id) => {
    setExamRows(examRows.filter((row) => row.id !== id))
  }

  // Function to fetch resources
  const fetchResources = async () => {
    if (!manageBranch || !manageSemester) return
    setIsLoadingResources(true)
    try {
      const queryParams = new URLSearchParams({
        branch: manageBranch,
        semester: manageSemester,
        ...(manageSubject && { subject: manageSubject }),
        ...(manageType && { type: manageType })
      })
      // const res = await fetch(`http://localhost:5000/api/resources?${queryParams}`)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/resources?${queryParams}`)
      if (!res.ok) throw new Error("Failed to fetch resources")
      const data = await res.json()
      setResources(data)
    } catch (error) {
      console.error("Error fetching resources:", error)
      setMessage("Failed to fetch resources")
      setMessageType("error")
    } finally {
      setIsLoadingResources(false)
    }
  }

  // Function to delete resource
  const deleteResource = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return
    try {
      // const res = await fetch(`http://localhost:5000/api/resources/${id}`, {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/resources/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete resource")
      setMessage("Resource deleted successfully")
      setMessageType("success")
      fetchResources()
    } catch (error) {
      console.error("Error deleting resource:", error)
      setMessage("Failed to delete resource")
      setMessageType("error")
    }
  }

  // Function to update resource
  const updateResource = async (e) => {
    e.preventDefault()
    if (!editResource) return
    try {
      const formData = new FormData()
      formData.append("title", editResource.title)
      if (editResource.description !== undefined) {
        formData.append("description", editResource.description)
      }
      if (editResource.link !== undefined) {
        formData.append("link", editResource.link)
      }
      if (editResource.newFile) {
        formData.append("file", editResource.newFile)
        
      }

      // const res = await fetch(`http://localhost:5000/api/resources/${editResource._id}`, {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/resources/${editResource._id}`, {
        method: "PUT",
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update resource")
      }

      const data = await res.json()
      setMessage("Resource updated successfully")
      setMessageType("success")
      setShowEditModal(false)
      fetchResources()
    } catch (error) {
      console.error("Error updating resource:", error)
      setMessage(error.message || "Failed to update resource")
      setMessageType("error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {isAuthenticating ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] text-xl text-gray-600 dark:text-gray-300">
          Loading...
        </div>
      ) : userRole !== 'admin' ? (
        <div className="flex flex-col items-center justify-center h-[100lvh] bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              Sorry, you do not have permission to access this page.
            </p>
            <Button onClick={() => router.push("/student/resources")} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg">
              Go to Student Resources
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Navigation Header */}
          <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
              {/* Logo */}
                <Link  href="/">
                {/* <a href="/"> */}
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-violet-600  to-slate-600 rounded-xl">
                      <Webhook className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">EduHub</span>
                  </div>
                  </Link>
                {/* </a> */}

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                  {/* Theme Toggle */}
                  <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="focus:outline-none">
                    {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
                  </Button>

                  {/* Admin Profile */}
                  {/* <a href="/admin/upload"> */}
                    <Link href={"/admin/upload"} >
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 border border-gray-200 dark:border-gray-700">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold">
                          A
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">ADMIN</span>
                    </div>
                    </Link>
                  {/* </a> */}
                  {/* notifications */}
                  <Link href={"/admin/users"} >
                  {/* <a href="/admin/users" target="_blank"> */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 border border-gray-200 dark:border-gray-700 cursor-pointer">
                      <Avatar className=" h-8 w-8">
                        <LucideUsers className="mt-1"/>
                      </Avatar>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Students</span>
                    </div>
                  {/* </a> */}
                  </Link>
                  {/* notifications */}

                  <Link href={"/admin/notifications"} >
                  {/* <a href="/admin/notifications" target="_blank"> */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 border border-gray-200 dark:border-gray-700 cursor-pointer">
                      <Avatar className=" h-8 w-8">
                        <BellPlus className="mt-1"/>
                      </Avatar>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
                    </div>
                  {/* </a> */}
                  </Link>
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
                  <a href= "/admin/upload/">
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
                    </a>

                    <a href="/admin/users" target="_parent">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 border border-gray-200 dark:border-gray-700 cursor-pointer">
                      <Avatar className=" h-8 w-8">
                        <LucideUsers className="mt-1"/>
                      </Avatar>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Students</span>
                    </div>
                  </a>

                  <a href="/admin/notifications" target="_parent">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 border border-gray-200 dark:border-gray-700 cursor-pointer">
                      <Avatar className=" h-8 w-8">
                        <BellPlus className="mt-1"/>
                      </Avatar>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
                    </div>
                  </a>


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
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Resources Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Resources</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalResources}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <BookOpenCheck className="h-4 w-4" />
                    Across all branches
                  </span>
                </div>
              </div>

              {/* Branch Stats Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Branches</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {Object.keys(stats.branchStats).length}
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="space-y-2">
                    {Object.entries(stats.branchStats).slice(0, 2).map(([branch, count]) => (
                      <div key={branch} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{branch}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                      </div>
                    ))}
                    {Object.keys(stats.branchStats).length > 2 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">+{Object.keys(stats.branchStats).length - 2} more</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Resource Types Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resource Types</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {Object.keys(stats.typeStats).length}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <FileSpreadsheet className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="space-y-2">
                    {Object.entries(stats.typeStats).slice(0, 2).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{type}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                      </div>
                    ))}
                    {Object.keys(stats.typeStats).length > 2 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">+{Object.keys(stats.typeStats).length - 2} more</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Uploads Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Uploads</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.recentUploads}</h3>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <Upload className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    Last 7 days
                  </span>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Resource Upload Center
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Upload and manage educational resources for students
              </p>
            </div>

            {/* Message Alert */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-xl border-l-4 ${
                  messageType === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300"
                    : "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300"
                } flex items-center gap-3 animate-in slide-in-from-top duration-300`}
              >
                {messageType === "success" ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="flex-1">{message}</span>
                <button
                  onClick={() => setMessage("")}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Main Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Upload New Resource
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Department
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="IT">Information Technology</option>
                      <option value="Computer">Computer Science Engineering</option>
                      <option value="Civil">Civil Engineering</option>
                      <option value="Mechanical">Mechanical Engineering</option>
                      <option value="Electrical">Electrical Engineering</option>
                      <option value="Chemical">Chemical Engineering</option>
                      <option value="AIML">AI & Machine Learning</option> 
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                      required
                    >
                      <option value="">Select Semester</option>
                      {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Resource Type Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Resource Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { value: "youtube", label: "YouTube Video", icon: Video },
                      { value: "handwritten", label: "Handwritten Notes", icon: FileText },
                      { value: "pdf", label: "PDF/Online Notes", icon: BookOpen },
                      { value: "pyq", label: "Previous Year Questions", icon: GraduationCap },
                      { value: "solution", label: "Solutions", icon: Target },
                      { value: "timetable", label: "Timetable", icon: CalendarIcon },
                    ].map((resourceType) => (
                      <button
                        key={resourceType.value}
                        type="button"
                        onClick={() => setType(resourceType.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          type === resourceType.value
                            ? `border-blue-500 bg-gradient-to-r ${getTypeColor(resourceType.value)} text-white shadow-lg transform scale-105`
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <resourceType.icon className="h-6 w-6" />
                          <span className="text-xs font-medium text-center">{resourceType.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Selection (if not timetable) */}
                {type !== "timetable" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                      required
                      disabled={!subjects.length}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((sub, idx) => (
                        <option key={idx} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Title and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input
                      type="text"
                      placeholder="Enter resource title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                    <input
                      type="text"
                      placeholder="Brief description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                    />
                  </div>
                </div>

                {/* File Upload or Link Input */}
                {type === "youtube" ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">YouTube URL</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                      required
                    />
                  </div>
                ) : type === "timetable" ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTimetableFormat("image")}
                        className={`flex-1 p-3 rounded-xl transition-all ${
                          timetableFormat === "image"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <ImageIcon className="h-5 w-5 mx-auto mb-1" />
                        Upload Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimetableFormat("table")}
                        className={`flex-1 p-3 rounded-xl transition-all ${
                          timetableFormat === "table"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <FileText className="h-5 w-5 mx-auto mb-1" />
                        Create Table
                      </button>
                    </div>

                    {timetableFormat === "image" ? (
                      <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                          dragActive
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="hidden"
                          id="timetable-image"
                          accept="image/*"
                        />
                        <label htmlFor="timetable-image" className="cursor-pointer">
                          <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {file ? file.name : "Drop your timetable image here"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse files</p>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Exam Row Input */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Add Exam Schedule</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                            <select
                              value={examInput.day}
                              onChange={(e) => setExamInput({ ...examInput, day: e.target.value })}
                              className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
                            >
                              <option value="">Day</option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                              <option value="Sunday">Sunday</option>
                            </select>
                            <input
                              type="date"
                              value={examInput.date}
                              onChange={(e) => setExamInput({ ...examInput, date: e.target.value })}
                              className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
                            />
                            <input
                              type="time"
                              value={examInput.startTime}
                              onChange={(e) => setExamInput({ ...examInput, startTime: e.target.value })}
                              className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
                            />
                            <input
                              type="time"
                              value={examInput.endTime}
                              onChange={(e) => setExamInput({ ...examInput, endTime: e.target.value })}
                              className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
                            />
                            <input
                              type="text"
                              placeholder="Subject/Exam"
                              value={examInput.subject}
                              onChange={(e) => setExamInput({ ...examInput, subject: e.target.value })}
                              className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={addExamRow}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              Add
                            </button>
                          </div>
                        </div>

                        {/* Table Preview */}
                        {examRows.length > 0 && (
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-700">
                              <h4 className="font-medium text-gray-700 dark:text-gray-300">Exam Schedule Preview</h4>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-blue-50 dark:bg-blue-900/30">
                                  <tr>
                                    <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Day</th>
                                    <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Date</th>
                                    <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">
                                      Start Time
                                    </th>
                                    <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">End Time</th>
                                    <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">
                                      Subject/Exam
                                    </th>
                                    <th className="p-3 text-center font-medium text-gray-700 dark:text-gray-300">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {examRows.map((row) => (
                                    <tr
                                      key={row.id}
                                      className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                      <td className="p-3 text-gray-700 dark:text-gray-300">{row.day}</td>
                                      <td className="p-3 text-gray-700 dark:text-gray-300">{row.date}</td>
                                      <td className="p-3 text-gray-700 dark:text-gray-300">{row.startTime}</td>
                                      <td className="p-3 text-gray-700 dark:text-gray-300">{row.endTime}</td>
                                      <td className="p-3 text-gray-700 dark:text-gray-300">{row.subject}</td>
                                      <td className="p-3 text-center">
                                        <button
                                          type="button"
                                          onClick={() => removeExamRow(row.id)}
                                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                        dragActive
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {file ? file.name : "Drop your file here"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse files</p>
                      </label>
                    </div>

                    {/* Optional Link */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        External Link (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/resource"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-3 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Upload Resource
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Resource Management Section */}
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Manage Resources
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                    <select
                      value={manageBranch}
                      onChange={(e) => setManageBranch(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Department</option>
                      <option value="IT">Information Technology</option>
                      <option value="Computer">Computer Science Engineering</option>
                      <option value="Civil">Civil Engineering</option>
                      <option value="Mechanical">Mechanical Engineering</option>
                      <option value="Electrical">Electrical Engineering</option>
                      <option value="Chemical">Chemical Engineering</option>
                      <option value="AIML">AI & Machine Learning</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
                    <select
                      value={manageSemester}
                      onChange={(e) => setManageSemester(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Semester</option>
                      {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                    <select
                      value={manageSubject}
                      onChange={(e) => setManageSubject(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                      disabled={!manageSubjects.length}
                    >
                      <option value="">Select Subject</option>
                      {manageSubjects.map((sub, idx) => (
                        <option key={idx} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resource Type</label>
                    <select
                      value={manageType}
                      onChange={(e) => setManageType(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Types</option>
                      <option value="youtube">YouTube Video</option>
                      <option value="handwritten">Handwritten Notes</option>
                      <option value="pdf">PDF/Online Notes</option>
                      <option value="pyq">Previous Year Questions</option>
                      <option value="solution">Solutions</option>
                      <option value="timetable">Timetable</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={fetchResources}
                  disabled={!manageBranch || !manageSemester || isLoadingResources}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-3 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoadingResources ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Search Resources
                    </>
                  )}
                </button>

                {/* Resources List */}
                {resources.length > 0 ? (
                  <div className="space-y-4">
                    {resources.map((resource) => (
                      <div
                        key={resource._id}
                        className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-4 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="secondary"
                                className={`${getTypeColor(resource.type)} text-white`}
                              >
                                {resource.type}
                              </Badge>
                              {resource.subject && (
                                <Badge variant="outline" className="dark:border-gray-600">
                                  {resource.subject}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {resource.title}
                            </h3>
                            {resource.description && (
                              <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {resource.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <a
                                href={resource.link || undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-1 ${resource.link ? 'hover:text-blue-600 dark:hover:text-blue-400' : 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                                tabIndex={resource.link ? 0 : -1}
                                aria-disabled={!resource.link}
                              >
                                <ExternalLink className="h-4 w-4" />
                                View Link
                              </a>
                              <a
                                href={resource.fileUrl || undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-1 ${resource.fileUrl ? 'hover:text-blue-600 dark:hover:text-blue-400' : 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                                tabIndex={resource.fileUrl ? 0 : -1}
                                aria-disabled={!resource.fileUrl}
                              >
                                <FileText className="h-4 w-4" />
                                View File
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditResource(resource)
                                setShowEditModal(true)
                              }}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteResource(resource._id)}
                              className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <Search className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No resources found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your filters or upload new resources
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Resource Modal */}
          {showEditModal && editResource && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Edit Resource
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditModal(false)}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <form onSubmit={updateResource} className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editResource.title}
                      onChange={(e) =>
                        setEditResource({ ...editResource, title: e.target.value })
                      }
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={editResource.description || ""}
                      onChange={(e) =>
                        setEditResource({ ...editResource, description: e.target.value })
                      }
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={editResource.link || ""}
                      onChange={(e) =>
                        setEditResource({ ...editResource, link: e.target.value })
                      }
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      File (Optional)
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                        dragActive
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDragActive(false)
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          setEditResource({ ...editResource, newFile: e.dataTransfer.files[0] })
                        }
                      }}
                    >
                      <input
                        type="file"
                        onChange={(e) => setEditResource({ ...editResource, newFile: e.target.files[0] })}
                        className="hidden"
                        id="edit-file-upload"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                      />
                      <label htmlFor="edit-file-upload" className="cursor-pointer">
                        <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {editResource.newFile ? editResource.newFile.name : "Drop new file here"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse files</p>
                      </label>
                    </div>
                    {editResource.fileUrl && !editResource.newFile && (
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Current file: {editResource.fileUrl.split('/').pop()}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <Footer />
        </>
      )}
    </div>
  )
}
