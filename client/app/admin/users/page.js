"use client"
import { useState, useEffect } from "react"
import {
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Brain,
  Menu,
  Moon,
  Sun,
  BellPlus,
  Edit,
  Users,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  LucideUsers,
  Webhook,
} from "lucide-react"
import { Avatar, AvatarFallback } from "/components/ui/avatar"
import { Button } from "/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "/components/ui/dialog"
import { Input } from "/components/ui/input"
import { Label } from "/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { Badge } from "/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "/components/ui/select"
import Footer from "/components/ui/footer"
import Link from "next/link"

export default function AdminManageUsersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [users, setUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState(null)
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

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("success"); // Reset to default
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
    checkUserRole()
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

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("studyhub_token")
      if (!token) {
        router.push("/login")
        return
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("studyhub_token")
          router.push("/login")
          return
        }
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data)
      setIsLoadingUsers(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      setMessage("Error fetching users")
      setMessageType("error")
      setIsLoadingUsers(false)
    }
  }

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

  const handleEditPasswordClick = (user) => {
    setEditingUser(user)
    setNewPassword("") // Clear previous password
    setShowPassword(false) // Hide password by default
    setShowEditPasswordModal(true)
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (!editingUser || !newPassword) {
      setMessage("New password cannot be empty.")
      setMessageType("error")
      return
    }

    setIsLoadingUsers(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${editingUser._id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      setMessage(`Password for ${editingUser.username} updated successfully!`)
      setMessageType("success")
      setShowEditPasswordModal(false)
      setEditingUser(null)
      
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage("Error updating password")
      setMessageType("error")
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleDeleteUser = async (userId, username) => {
    setIsLoadingUsers(true)
    setDeletingUserId(userId)
    try {
      const token = localStorage.getItem("studyhub_token")
      if (!token) {
        router.push("/login")
        return
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("studyhub_token")
          router.push("/login")
          return
        }
        if (response.status === 403) {
          setMessage("Access denied. Admin privileges required.")
          setMessageType("error")
          return
        }
        throw new Error('Failed to delete user');
      }

      setMessage(`User ${username} deleted successfully!`)
      setMessageType("success")
      
      setTimeout(async () => {
        setDeletingUserId(null);
        await fetchUsers();
      }, 300);

    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage("Error deleting user")
      setMessageType("error")
      setDeletingUserId(null);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
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
                {/* <a href="/"> */}
                <Link href={"/"}>
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
                  <Link href={"/admin/upload"}>
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
                  
                  <a href="/admin/users">
                  {/* <Link href={"users"}> */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 border border-gray-200 dark:border-gray-700 cursor-pointer">
                    <Avatar className=" h-8 w-8">
                      <LucideUsers className="mt-1"/>
                    </Avatar>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Students</span>
                  </div>
                  {/* </Link> */}
                  </a>

                  {/* notifications */}
                  {/* <a href="/admin/notifications" target="_blank" rel="noreferrer"> */}
                  <Link href={"notifications"}>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 border border-gray-200 dark:border-gray-700 cursor-pointer">
                    <Avatar className=" h-8 w-8">
                      <BellPlus className="mt-1"/>
                    </Avatar>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
                  </div>
                  </Link>
                  {/* </a> */}
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
                  <a href="/admin/upload/">
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

                    <a href="/admin/users">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 border border-gray-200 dark:border-gray-700 cursor-pointer">
                    <Avatar className=" h-8 w-8">
                      <LucideUsers className="mt-1"/>
                    </Avatar>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Students</span>
                  </div>
                  </a>
                  {/* notifications */}
                  <a href="/admin/notifications" target="_parent" rel="noreferrer">
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

          <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8 flex-grow">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Manage Students
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">View, edit, and delete student accounts</p>
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

              {/* Stats Section */}
              <div className="flex flex-row sm:flex-row gap-3 justify-center items-center mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 flex flex-col items-center min-w-[110px]">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Total Users</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{users.length}</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 flex flex-col items-center min-w-[110px]">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Admins</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{users.filter(u => u.role === 'admin').length}</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 flex flex-col items-center min-w-[110px]">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Students</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">{users.filter(u => u.role === 'student').length}</span>
                </div>
              </div>

              {/* Users List Section */}
              <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-900 p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    All Students
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {isLoadingUsers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-500 dark:text-gray-400">Loading students...</p>
                    </div>
                  ) : users.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {users.map((user) => (
                        <Card
                          key={user._id}
                          className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${deletingUserId === user._id ? 'opacity-0 translate-y-4' : ''}`}
                        >
                          <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg">
                                {user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user.username}
                              </CardTitle>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <div className="flex flex-col gap-3 md:flex-row md:justify-end md:items-center">
                              <div className="flex flex-row gap-2 w-full md:w-auto justify-between">
                                <Select 
                                  value={user.role}
                                  onValueChange={async (newRole) => {
                                    if (newRole === user.role) return;
                                    setIsLoadingUsers(true);
                                    try {
                                      const token = localStorage.getItem("studyhub_token");
                                      if (!token) {
                                        router.push("/login");
                                        return;
                                      }
                                      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${user._id}/role`, {
                                        method: 'PUT',
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                          'Content-Type': 'application/json',
                                          Accept: 'application/json',
                                        },
                                        body: JSON.stringify({ role: newRole })
                                      });
                                      if (!response.ok) {
                                        if (response.status === 401) {
                                          localStorage.removeItem("studyhub_token");
                                          router.push("/login");
                                          return;
                                        }
                                        throw new Error('Failed to update role');
                                      }
                                      setMessage(`Role for ${user.username} updated to ${newRole}!`);
                                      setMessageType("success");
                                      await fetchUsers();
                                    } catch (error) {
                                      setMessage("Error updating role");
                                      setMessageType("error");
                                    } finally {
                                      setIsLoadingUsers(false);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-[120px] dark:hover:bg-blue-800/20 ">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className= "dark:bg-slate-800">
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              {/* </div> */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPasswordClick(user)}
                                className="hover:bg-blue-50 dark:hover:bg-blue-800/20 h-auto"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Password
                              </Button>
                              </div>
                              <div className="flex justify-center md:justify-end w-full">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 w-full md:w-auto"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the account of{" "}
                                      {user.username} and remove their data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(user._id, user.username)}>
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <Users className="h-12 w-12 mx-auto" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No students found.</p>
                      <p className="text-sm text-gray-400 mt-1">Add new students or check your database connection.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Edit Password Modal */}
            {showEditPasswordModal && editingUser && (
              <Dialog open={showEditPasswordModal} onOpenChange={setShowEditPasswordModal}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">
                      Change Password for {editingUser?.username}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdatePassword} className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-gray-700 dark:text-gray-300">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-1 text-gray-500 dark:text-gray-400 hover:bg-transparent transition-transform duration-200"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowEditPasswordModal(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoadingUsers}>
                        {isLoadingUsers ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <KeyRound className="h-4 w-4 mr-2" />
                            Save Password
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            <Footer />
          </div>
        </>
      )}
    </div>
  )
}
