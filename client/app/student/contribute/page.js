"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import emailjs from '@emailjs/browser';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/components/ui/card";
import { Button } from "/components/ui/button"
import { Youtube, FileText, BookOpen, Calendar, Mail, Upload, Send, CheckCircle, Heart, Star, Users, Sparkles, Target, Bell, Sun, Moon, ChevronDown, Menu, X, AlertCircle, Info, X as LucideX, Trash2, Brain, BrainCircuit, ShieldUser, User , LogOut} from 'lucide-react';
import { Input } from "/components/ui/input";
import { Textarea } from "/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/components/ui/select";
import { Label } from "/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "/components/ui/dropdown-menu";
import Link from "next/link";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    name: "",
    email: "kvshah25092005@gmail.com",
    u_email: "",
    branch: "",
    semester: "",
    subject: "",
    resourceType: "",
    title: "",
    description: "",
    resourceUrl: "",
    cloudStorageLink: "",
    additionalNotes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // State variables copied from resources page for navbar functionality
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("studyhub_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    
    fetch("http://localhost:5000/api/auth/me", {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Not authenticated");
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }
        return res.json();
      })
      .then((data) => {
        if (!data || !data.username || !data.email) {
          throw new Error("Incomplete user data");
        }
        setUser({
          name: data.username,
          email: data.email
        });
      })
      .catch((error) => {
        console.error("Auth error:", error.message);
        localStorage.removeItem("studyhub_token");
        window.location.href = "/login";
      });
  }, []);

  // Fetch notifications (Placeholder - adjust if notifications are not needed on this page)
  useEffect(() => {
    const token = localStorage.getItem("studyhub_token");
    if (!token) return;
    // You might remove notification fetching if not relevant for this page
    fetch("http://localhost:5000/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      });
  }, []);

  // Mark all notifications as read (Placeholder - remove if notifications are not needed)
  const markAllNotificationsRead = async () => {
    const token = localStorage.getItem("studyhub_token");
    if (!token) return;
    setNotifLoading(true);
    await fetch("http://localhost:5000/api/notifications/mark-all-read", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    // Replace fetchNotifications with direct state update or remove if notifcations not used
    // fetchNotifications();
    setNotifLoading(false);
  };

  // Delete a notification (Placeholder - remove if notifications are not needed)
  const handleDeleteNotification = async (id) => {
    const token = localStorage.getItem("studyhub_token");
    if (!token) return;
    setNotifLoading(true);
    await fetch(`http://localhost:5000/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
     // Replace fetchNotifications with direct state update or remove if notifcations not used
    // fetchNotifications();
    setNotifLoading(false);
  };

  // Refetch notifications (Placeholder - remove if notifications are not needed)
  const fetchNotifications = () => {
     const token = localStorage.getItem("studyhub_token");
    if (!token) return;
     // You might remove notification fetching if not relevant for this page
    fetch("http://localhost:5000/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      });
  };

  // Get notification icon type (Placeholder - remove if notifications are not needed)
  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Modal close handler (Placeholder - remove if notifications are not needed)
  const closeNotifModal = () => {
    setShowNotifModal(false);
    setSelectedNotification(null);
  };

  const handleSubmissionInputChange = (field, value) => {
    setSubmissionForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleResourceTypeChange = (type) => {
    // Reset URL fields when changing resource type
    setSubmissionForm(prev => ({
      ...prev,
      resourceType: type,
      resourceUrl: "",
      cloudStorageLink: ""
    }));
  };

  const handleSubmissionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare template parameters
      const templateParams = {
        name: submissionForm.name,
        email: submissionForm.email,
        u_email: submissionForm.u_email,
        branch: submissionForm.branch,
        semester: submissionForm.semester,
        subject: submissionForm.subject,
        resource_type: submissionForm.resourceType,
        title: submissionForm.title,
        description: submissionForm.description,
        resource_url: submissionForm.resourceUrl || 'N/A',
        cloud_storage_link: submissionForm.cloudStorageLink || 'N/A',
        additional_notes: submissionForm.additionalNotes || 'N/A',
        resource_type_emoji: {
          youtube: "🎥",
          handwritten: "✍️",
          notes: "📝",
          pyq: "📚",
          solution: "✅",
          timetable: "📅"
        }[submissionForm.resourceType] || "📄",
        branch_emoji: {
          IT: "💻",
          Computer: "🖥️",
          AIML: "🤖",
          Civil: "🏗️",
          Mechanical: "⚙️",
          Electrical: "⚡",
          Chemical: "🧪"
        }[submissionForm.branch] || "🎓"
      };

      // Send email using EmailJS
      await emailjs.send(
        "service_c8k4vvq",
        "template_tzjkije",
        templateParams,
        "svea4TicuBNxllkQ7"
      );

      setSubmitStatus("success");
      
      // Reset form after successful submission
      setSubmissionForm({
        name: "",
        email: "kvshah25092005@gmail.com",
        u_email: "",
        branch: "",
        semester: "",
        subject: "",
        resourceType: "",
        title: "",
        description: "",
        resourceUrl: "",
        cloudStorageLink: "",
        additionalNotes: ""
      });

    } catch (error) {
      console.error('Error submitting resource:', error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    }
  };

  const resourceTypes = [
    { value: "youtube", label: "YouTube Video", icon: Youtube, needsUrl: true },
    { value: "handwritten", label: "Handwritten Notes", icon: FileText, needsCloudLink: true },
    { value: "notes", label: "PDF/Online Notes", icon: BookOpen, needsCloudLink: true },
    { value: "pyq", label: "Previous Year Questions", icon: FileText, needsCloudLink: true },
    { value: "solution", label: "Solutions", icon: Target, needsCloudLink: true },
    { value: "timetable", label: "Timetable", icon: Calendar, needsCloudLink: true },
  ];

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("studyhub_token");
    window.location.href = "/login";
  };

  // Show loading spinner while user data is being fetched
  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
               <div className="p-2 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                EduHub
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Show notifications"
                  onClick={() => setShowNotifications((v) => !v)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-900">{unreadCount}</span>
                  )}
                </Button>
                {/* Dropdown */}
                <div
                  className={`transition-all duration-200 ${showNotifications ? 'opacity-100 visible' : 'opacity-0 invisible'} absolute right-0 mt-2 w-[95vw] max-w-md sm:max-w-sm bg-white dark:bg-gray-900 shadow-2xl rounded-2xl z-50 border border-gray-200 dark:border-gray-700`}
                  tabIndex={-1}
                  aria-label="Notifications dropdown"
                >
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-2xl">
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">Notifications</span>
                    <button
                      className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                      onClick={markAllNotificationsRead}
                      disabled={unreadCount === 0 || notifLoading}
                      aria-label="Mark all as read"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 p-2 sm:p-3">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                        <Bell className="h-10 w-10 mb-2" />
                        <span className="text-base">No notifications yet</span>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`group flex items-start gap-3 rounded-xl px-3 py-4 mb-1 bg-gradient-to-r ${!n.read ? 'from-blue-50 to-white dark:from-blue-950 dark:to-gray-900' : 'from-white to-white dark:from-gray-900 dark:to-gray-900'} shadow-sm hover:shadow-md transition-all relative cursor-pointer`}
                          onClick={() => { setSelectedNotification(n); setShowNotifModal(true); }}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold text-gray-900 dark:text-white truncate ${!n.read ? 'group-hover:text-blue-700 dark:group-hover:text-blue-400' : ''}`}>{n.title}</span>
                              {!n.read && <span className="ml-1 h-2 w-2 rounded-full bg-blue-500" />}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 truncate">{n.message}</div>
                            <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                          </div>
                          <button
                            className="ml-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                            aria-label="Delete notification"
                            onClick={e => { e.stopPropagation(); handleDeleteNotification(n._id); }}
                            disabled={notifLoading}
                          >
                            <LucideX className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              {/* Theme Toggle */}
              <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3"
                  >
                    <Avatar className="h-8 w-8">
                      {user ? (
                        <AvatarImage src={"http://localhost:5000/placeholder.svg"} alt={user.name} />
                      ) : (
                        <AvatarFallback>U</AvatarFallback>
                      )}
                      {user ? (
                        <AvatarFallback className="bg-blue-500 text-white">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback>U</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 dark:bg-gray-800 dark:border-gray-700"
                >
                  <DropdownMenuLabel className="dark:text-white">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    <span><a target="_blank" rel="noopener noreferrer" href="/ai-tools">Context Aware Ai </a></span>
                  </DropdownMenuItem>
                  {/* Link to Resources Page */}
                   <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <FileText className="mr-2 h-4 w-4" /> {/* Using FileText for Resources Page */}
                    <span>
                      <Link
                        href="/student/resources"
                         className="flex items-center"
                      >
                        View Resources
                      </Link>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <ShieldUser  className="mr-2 h-4 w-4" />
                    <span><a target="_blank" rel="noopener noreferrer" href="/admin/upload">Admin</a></span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && user && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-10 w-10">
                    {user ? (
                      <AvatarImage src={"/placeholder.svg"} alt={user.name} />
                    ) : (
                      <AvatarFallback>U</AvatarFallback>
                    )}

                    <AvatarFallback className="bg-blue-500 text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                 {/* Link to Resources Page in Mobile Menu */}
                 <Button
                  variant="ghost"
                  className="justify-start"
                >
                   <FileText className="mr-2 h-4 w-4" /> {/* Using FileText for Resources Page */}
                   <span>
                      <Link
                        href="/student/resources"
                         className="flex items-center"
                      >
                        View Resources
                      </Link>
                    </span>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </Button>
                <Button variant="ghost" className="justify-start">
                <BrainCircuit className="mr-2 h-4 w-4" />
                <span><a target="_blank" rel="noopener noreferrer" href="/ai-tools">Context Aware Ai </a></span>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Notification Modal (Placeholder - remove if notifications are not needed) */}
      {showNotifModal && selectedNotification && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeNotifModal}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative animate-fadeIn"
            onClick={e => e.stopPropagation()}
            tabIndex={0}
            aria-modal="true"
            role="dialog"
          >
            <button
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              onClick={closeNotifModal}
              aria-label="Close notification modal"
            >
              <LucideX className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              {getTypeIcon(selectedNotification.type)}
              <h2 className="text-lg font-bold text-gray-900 dark:text-white break-words">
                {selectedNotification.title}
              </h2>
            </div>
            <div className="text-gray-700 dark:text-gray-200 text-base whitespace-pre-line break-words mb-4">
              {selectedNotification.message}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(selectedNotification.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <main className=" mx-auto py-12 px-4">
        {/* Resource Submission Section */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 py-16 -mx-4">
          <div className="container mx-auto px-4">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Contribute Resources
                </h2>
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Help your fellow students by sharing valuable educational resources. Submit your materials for admin review
                and potential inclusion in our platform.
              </p>

              {/* Benefits Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl w-fit mx-auto mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Help Others Learn</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Share your knowledge and help fellow students succeed in their academic journey.
                  </p>
                </div>

                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl w-fit mx-auto mb-4">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Build Reputation</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Get recognized for your contributions and build your academic reputation.
                  </p>
                </div>

                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl w-fit mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quality Assured</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    All submissions are reviewed by admins to ensure high-quality content.
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Form */}
            <Card className="max-w-9xl mx-auto shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 p-6 border-b border-gray-200/50 dark:border-gray-700/50 mt-[-24px]">
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  Submit Resource for Review
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Fill out the form below to submit your educational resource for admin review.
                </p>
              </div>

              <CardContent className="p-8">
                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-200">Submission Successful!</p>
                      <p className="text-green-600 dark:text-green-300 text-sm">
                        Your email client should open with the submission details. Thank you for contributing!
                      </p>
                    </div>
                  </div>
                )}
                 {submitStatus === "error" && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-200">Submission Failed.</p>
                      <p className="text-red-600 dark:text-red-300 text-sm">
                       There was an error submitting your resource. Please try again later.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmissionSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Your Name *</Label>
                      <Input
                        placeholder="Enter your full name"
                        value={submissionForm.name}
                        onChange={(e) => handleSubmissionInputChange("name", e.target.value)}
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Your Email *</Label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={submissionForm.u_email}
                        onChange={(e) => handleSubmissionInputChange("u_email", e.target.value)}
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Branch *</Label>
                      <select
                        value={submissionForm.branch}
                        onChange={(e) => handleSubmissionInputChange("branch", e.target.value)}
                        className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-white dark:bg-gray-700 dark:text-white px-3"
                        required
                      >
                        <option value="">Select Branch</option>
                        <option value="IT">Information Technology</option>
                        <option value="Computer">Computer Science</option>
                        <option value="AIML">AI & Machine Learning</option>
                        <option value="Civil">Civil Engineering</option>
                        <option value="Mechanical">Mechanical Engineering</option>
                        <option value="Electrical">Electrical Engineering</option>
                        <option value="Chemical">Chemical Engineering</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Semester *</Label>
                      <select
                        value={submissionForm.semester}
                        onChange={(e) => handleSubmissionInputChange("semester", e.target.value)}
                        className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 transition-colors bg-white dark:bg-gray-700 dark:text-white px-3"
                        required
                      >
                        <option value="">Select Semester</option>
                        {[...Array(8)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Semester {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Subject *</Label>
                      <Input
                        placeholder="e.g., Data Structures"
                        value={submissionForm.subject}
                        onChange={(e) => handleSubmissionInputChange("subject", e.target.value)}
                        className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-green-400 dark:hover:border-green-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Resource Information */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Resource Type *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {resourceTypes.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => handleResourceTypeChange(type.value)}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                submissionForm.resourceType === type.value
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-lg"
                                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              <IconComponent className="h-6 w-6 mx-auto mb-2" />
                              <span className="text-sm font-medium">{type.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Resource Title *</Label>
                        <Input
                          placeholder="e.g., Complete DSA Tutorial Series"
                          value={submissionForm.title}
                          onChange={(e) => handleSubmissionInputChange("title", e.target.value)}
                          className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                          required
                        />
                      </div>

                      {/* Conditional URL or Cloud Storage Link Input */}
                      <div className="space-y-2">
                        {submissionForm.resourceType === "youtube" ? (
                          <>
                            <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              YouTube URL *
                            </Label>
                            <Input
                              type="url"
                              placeholder="https://youtube.com/watch?v=..."
                              value={submissionForm.resourceUrl}
                              onChange={(e) => handleSubmissionInputChange("resourceUrl", e.target.value)}
                              className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-red-400 dark:hover:border-red-500 transition-colors"
                              required={submissionForm.resourceType === "youtube"}
                            />
                          </>
                        ) : submissionForm.resourceType && submissionForm.resourceType !== "youtube" ? (
                          <>
                            <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Cloud Storage Link *
                            </Label>
                            <Input
                              type="url"
                              placeholder="https://drive.google.com/... or https://www.dropbox.com/..."
                              value={submissionForm.cloudStorageLink}
                              onChange={(e) => handleSubmissionInputChange("cloudStorageLink", e.target.value)}
                              className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
                              required={submissionForm.resourceType && submissionForm.resourceType !== "youtube"}
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Please provide a Dropbox, Google Drive, or other cloud storage link to your resource.
                            </p>
                          </>
                        ) : (
                          <>
                            <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              Resource URL/Link
                            </Label>
                            <Input
                              placeholder="Select resource type first"
                              disabled
                              value=""
                              className="h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-600"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Description *</Label>
                      <Textarea
                        placeholder="Provide a detailed description of the resource, its content, and why it would be valuable for students..."
                        value={submissionForm.description}
                        onChange={(e) => handleSubmissionInputChange("description", e.target.value)}
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-green-400 dark:hover:border-green-500 transition-colors resize-none"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Additional Notes</Label>
                      <Textarea
                        placeholder="Any additional information, special instructions, or context about the resource..."
                        value={submissionForm.additionalNotes}
                        onChange={(e) => handleSubmissionInputChange("additionalNotes", e.target.value)}
                        className="border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-orange-400 dark:hover:border-orange-500 transition-colors resize-none"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !submissionForm.name ||
                        !submissionForm.u_email ||
                        !submissionForm.branch ||
                        !submissionForm.semester ||
                        !submissionForm.subject ||
                        !submissionForm.resourceType ||
                        !submissionForm.title ||
                        !submissionForm.description ||
                        (submissionForm.resourceType === "youtube" && !submissionForm.resourceUrl) ||
                        (submissionForm.resourceType !== "youtube" && submissionForm.resourceType && !submissionForm.cloudStorageLink)
                      }
                      className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          Preparing Submission...
                        </>
                      ) : (
                        <>
                          <Send className="h-6 w-6 mr-3" />
                          Submit Resource for Review
                        </>
                      )}
                    </Button>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                      By submitting, you agree that your resource will be reviewed by our admin team and may be published on
                      the platform with proper attribution.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-4 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          © 2024 EduHub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}