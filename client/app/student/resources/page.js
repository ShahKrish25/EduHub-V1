"use client";
import { useEffect, useState, useRef } from "react";
import {
  Search,
  Youtube,
  FileText,
  BookOpen,
  Calendar,
  Download,
  Eye,
  Clock,
  Play,
  ExternalLink,
  Star,
  TrendingUp,
  Users,
  Award,
  Grid,
  List,
  ChevronRight,
  Sparkles,
  User,
  LogOut,
  Mail,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  Bell,
  BellRing,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  X as LucideX,
  Trash2,
  Brain,
  BrainCircuit,
  ShieldUser,
  Rocket,
  BotMessageSquareIcon,
  LucideScreenShare,
  FlameIcon,
  UserSquare2,
  GitBranchIcon,
  BookmarkPlus,
  Webhook,
} from "lucide-react";
import Footer from "/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";
import { Button } from "/components/ui/button";
import { Badge } from "/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "/components/ui/avatar";

import Link from "next/link";
import { TextGenerateEffect } from "/app/ui/text-generate-effect";
import { Meteors } from "/app/ui/meteors";
const dotenv = require("dotenv");
export default function StudentResourceHub() {
  dotenv.config();
  const [user, setUser] = useState(null);
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [resources, setResources] = useState({
    youtube: [],
    handwritten: [],
    notes: [],
    pyq: [],
    solutions: [],
    timetable: null,
  });
  const [loading, setLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState({
    show: false,
    type: "",
    url: "",
    title: "",
  });
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalResources: 0,
    activeStudents: 0,
    branches: 7,
    subjects: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const firstResourceRef = useRef(null);
  const [firstResourceId, setFirstResourceId] = useState(null);
  const [timetableResources, setTimetableResources] = useState([]);
  const [showTextEffect, setShowTextEffect] = useState(false);

  const noSubjects = subjects.length === 0;

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

  // Load subjects dynamically when branch/semester changes
  useEffect(() => {
    const token = localStorage.getItem("studyhub_token");
    if (branch && semester) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/resources/subjects?branch=${branch}&semester=${semester}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
        .then((res) => {
          // if (!res.ok) throw new Error("Failed to fetch subjects");
          if (!res.ok) {
            setSubject(["No subjects found"]);
            return;
          }
          return res.json();
        })
        .then((data) => {
          setSubjects(data.subjects || []);
          setStats((prev) => ({
            ...prev,
            subjects: data.subjects?.length || 0,
          }));
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
          setSubjects([]);
        });
    } else {
      setSubjects([]);
    }
  }, [branch, semester]);

  // Load initial stats
  useEffect(() => {
    const token = localStorage.getItem("studyhub_token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => {
        setStats({
          totalResources: data.totalResources || 0,
          activeStudents: data.activeStudents || 0,
          branches: data.branches || 7,
          subjects: data.subjects || 0,
        });
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setStats({
          totalResources: 0,
          activeStudents: 0,
          branches: 7,
          subjects: 0,
        });
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("studyhub_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
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
          name: data.username, // Map username to name for the UI
          email: data.email,
          role: data.role,
        });
      })
      .catch((error) => {
        console.error("Auth error:", error.message);
        localStorage.removeItem("studyhub_token"); // Clear invalid token
        window.location.href = "/login";
      });
  }, []);
  // console.log(user.role);

  // Fetch notifications
  useEffect(() => {
    const token = localStorage.getItem("studyhub_token");
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      });
  }, []);

  useEffect(() => {
    if (!branch || !semester) {
      setTimetableResources([]);
      return;
    }
    // console.log('Fetching timetable for:', branch, semester);
    const token = localStorage.getItem("studyhub_token");
    if (!token) return;
    fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }api/resources?branch=${encodeURIComponent(
        branch
      )}&semester=${encodeURIComponent(semester)}&type=timetable`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // Check the data received and the filtered data
        // console.log('Raw timetable data response:', data);
        const filteredTimetables = data.filter((r) => r.type === "timetable");
        // console.log('Filtered timetable data:', filteredTimetables);
        setTimetableResources(filteredTimetables);
      })
      .catch(() => setTimetableResources([]));
  }, [branch, semester]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTextEffect(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async () => {
    if (!branch || !semester || !subject) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("studyhub_token");
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }api/resources?branch=${encodeURIComponent(
          branch
        )}&semester=${encodeURIComponent(
          semester
        )}&subject=${encodeURIComponent(subject)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // if (!res.ok) {
      //   console.log("failed to fetch...", res.status);
      // }

      const data = await res.json();
      // console.log('Fetched resources:', data); // Debug log

      setFirstResourceId(data.length > 0 ? data[0]._id : null);

      const organizedResources = {
        youtube: data.filter((r) => r.type === "youtube") || [],
        handwritten: data.filter((r) => r.type === "handwritten") || [],
        notes: data.filter((r) => r.type === "notes" || r.type === "pdf") || [],
        pyq: data.filter((r) => r.type === "pyq") || [],
        solutions: data.filter((r) => r.type === "solution") || [],
        timetable: data.find((r) => r.type === "timetable") || null,
      };

      setResources(organizedResources);
      setTimeout(() => {
        if (firstResourceRef.current && activeTab === "all") {
          firstResourceRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 200);
    } catch (error) {
      // console.error("Error fetching resources:", error);
      setResources({
        youtube: [],
        handwritten: [],
        notes: [],
        pyq: [],
        solutions: [],
        timetable: null,
      });
      setFirstResourceId(null);
    }
    setLoading(false);
  };

  const openPreview = (type, url, title) => {
    setPreviewModal({ show: true, type, url, title });
  };

  const closePreview = () => {
    setPreviewModal({ show: false, type: "", url: "", title: "" });
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  const handleLogout = () => {
    localStorage.removeItem("studyhub_token");
    window.location.href = "/login";
  };

  const StatCard = ({ icon: Icon, title, value, description, gradient }) => (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
      <div className={`absolute inset-0 ${gradient} opacity-10`} />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          </div>
          <div className={`p-3 rounded-full ${gradient}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ResourceCard = ({ item, type, index }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-md overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <div className="relative">
        <div
          className={`h-2 ${
            type === "youtube"
              ? "bg-gradient-to-r from-red-400 to-red-600"
              : type === "handwritten"
              ? "bg-gradient-to-r from-orange-400 to-orange-600"
              : type === "notes"
              ? "bg-gradient-to-r from-green-400 to-green-600"
              : type === "pyq"
              ? "bg-gradient-to-r from-blue-400 to-blue-600"
              : "bg-gradient-to-r from-purple-400 to-purple-600"
          }`}
        />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            <Badge
              variant="secondary"
              className="ml-2 dark:bg-gray-700 dark:text-gray-300"
            >
              #{index + 1}
            </Badge>
          </div>

          <div className="flex gap-2">
            {type === "youtube" && item.link && (
              <>
                <Button
                  onClick={() => openPreview("youtube", item.link, item.title)}
                  size="sm"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Watch
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <a href={item.link} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </>
            )}
            {(type === "notes" ||
              type === "handwritten" ||
              type === "pyq" ||
              type === "solutions") && (
              <>
                {item.fileUrl && (
                  <>
                    {item.link && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <a href={item.link} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open Resource
                        </a>
                      </Button>
                    )}
                    <Button
                      onClick={() =>
                        openPreview("pdf", `${item.fileUrl}`, item.title)
                      }
                      size="sm"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900 dark:hover:text-green-400"
                    >
                      <a target="_blank" href={`${item.fileUrl}`} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </>
                )}
                {item.link && !item.fileUrl && (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <a href={item.link} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open Resource
                    </a>
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );

  const ResourceSection = ({ icon: Icon, title, items, type, gradient }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${gradient}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {items?.length || 0} resources available
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-xs dark:border-gray-600 dark:text-gray-400"
        >
          {items?.length || 0}
        </Badge>
      </div>

      {!items || items.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <Icon className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No {title.toLowerCase()} available yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Resources will appear here once added
            </p>
          </CardContent>
        </Card>
      ) : (
        <div
          className={`grid gap-4 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {items.map((item, idx) => (
            <div
              key={item._id || idx}
              ref={
                item._id === firstResourceId && activeTab === "all"
                  ? firstResourceRef
                  : null
              }
            >
              <ResourceCard item={item} type={type} index={idx} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
  console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/notifications/mark-all-read`);
  // Mark all notifications as read
  const markAllNotificationsRead = async () => {
    const token = localStorage.getItem("studyhub_token");
    if (!token) return;
    setNotifLoading(true);
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/notifications/mark-all-read`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchNotifications();
    setNotifLoading(false);
  };

  // Delete a notification
  const handleDeleteNotification = async (id) => {
    const token = localStorage.getItem("studyhub_token");
    if (!token) return;
    setNotifLoading(true);
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/notifications/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchNotifications();
    setNotifLoading(false);
  };

  // Refetch notifications
  const fetchNotifications = () => {
    const token = localStorage.getItem("studyhub_token");
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Modal close handler
  const closeNotifModal = () => {
    setShowNotifModal(false);
    setSelectedNotification(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navigation Header */}
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-violet-600 to-slate-600 rounded-xl">
                <Webhook className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold dark:text-zinc-300 text-gray-700 cursor-pointer">
                <Link href={"/"}> EduHub</Link>
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
                  <BellRing className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-900">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                {/* Dropdown */}
                <div
                  className={`transition-all duration-200 ${
                    showNotifications
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  } absolute right-0 mt-2 w-[95vw] max-w-md sm:max-w-sm bg-white dark:bg-gray-900 shadow-2xl rounded-2xl z-50 border border-gray-200 dark:border-gray-700`}
                  tabIndex={-1}
                  aria-label="Notifications dropdown"
                >
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-2xl">
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">
                      Notifications
                    </span>
                    <button
                      className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                      onClick={markAllNotificationsRead}
                      disabled={unreadCount === 0 || notifLoading}
                      aria-label="Mark all as read"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 p-2 sm:p-3">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                        <BellRing className="h-10 w-10 mb-2" />
                        <span className="text-base">No notifications yet</span>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`group flex items-start gap-3 rounded-xl px-3 py-4 mb-1 bg-gradient-to-r ${
                            !n.read
                              ? "from-blue-50 to-white dark:from-blue-950 dark:to-gray-900"
                              : "from-white to-white dark:from-gray-900 dark:to-gray-900"
                          } shadow-sm hover:shadow-md transition-all relative cursor-pointer`}
                          onClick={() => {
                            setSelectedNotification(n);
                            setShowNotifModal(true);
                          }}
                        >
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-semibold text-gray-900 dark:text-white truncate ${
                                  !n.read
                                    ? "group-hover:text-blue-700 dark:group-hover:text-blue-400"
                                    : ""
                                }`}
                              >
                                {n.title}
                              </span>
                              {!n.read && (
                                <span className="ml-1 h-2 w-2 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                              {n.message}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(n.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {/* <button
                            className="ml-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                            aria-label="Delete notification"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(n._id);
                            }}
                            disabled={notifLoading}
                          >
                            <LucideX className="h-4 w-4 text-red-500" />
                          </button> */}
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
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}placeholder.svg`}
                          alt={user.name}
                        />
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
                  <DropdownMenuLabel className="dark:text-white flex items-center gap-3">
                    {user.role === "admin" ? (
                      <>
                        <ShieldUser /> Administer
                      </>
                    ) : (
                      <>
                        <UserSquare2 /> Student Profile
                      </>
                    )}
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
                    <span>
                      {/* <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/ai-tools"
                      > */}
                      <Link href={"/ai-tools"} >
                        Context Aware Ai
                      {/* </a> */}
                      </Link>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <LucideScreenShare className="mr-2 h-4 w-4" />
                    <span>
                      <Link
                        href="/student/contribute"
                        className="flex items-center"
                      >
                        Contribute Resources
                      </Link>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <BotMessageSquareIcon className="mr-2 h-4 w-4" />
                    <span>
                      <Link
                        href="https://chat-pro-v1.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        ChatPro Playground
                      </Link>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <ShieldUser className="mr-2 h-4 w-4" />
                    <span>
                      {/* <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/admin/upload"
                      > */}
                      <Link href={"/admin/upload"} target="_blank">
                        Admin
                      {/* </a> */}
                    </Link>
                    </span>
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

            {/* Mobile Navigation Buttons */}
            <div className="flex items-center gap-2 md:hidden pointer-events-none">
              <div className="pointer-events-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative z-10 pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Show notifications"
                  onClick={() => {
                    console.log(
                      "Mobile notifications button clicked, current showNotifications:",
                      showNotifications
                    );
                    setMobileMenuOpen(false); // Close mobile menu to avoid overlap
                    setShowNotifications((v) => !v);
                  }}
                  onTouchStart={() => {
                    console.log("Mobile notifications button touched");
                    setMobileMenuOpen(false);
                    setShowNotifications((v) => !v);
                  }}
                >
                  <BellRing className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-900">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </div>
              <div className="pointer-events-auto">
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
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="flex flex-col space-y-3 px-3">
                {/* User Info */}
                <div className="flex items-center gap-3 py-2">
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
                {/* Navigation Links */}
                <Button
                  variant="ghost"
                  className="justify-start dark:text-gray-300 dark:hover:bg-gray-700"
                  asChild
                >
                  <Link
                    href="/student/contribute"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full"
                  >
                    <LucideScreenShare className="mr-2 h-4 w-4" />
                    Contribute Resources
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start dark:text-gray-300 dark:hover:bg-gray-700"
                  asChild
                >
                  <Link
                    href="https://chat-pro-v1.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full"
                  >
                    <BotMessageSquareIcon className="mr-2 h-4 w-4" />
                    ChatPro Playground
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start dark:text-gray-300 dark:hover:bg-gray-700"
                  asChild
                >
                  <a
                    href="/admin/upload"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full"
                  >
                    <ShieldUser className="mr-2 h-4 w-4" />
                    Admin
                  </a>
                </Button>
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  className="justify-start dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </Button>
                {/* Logout */}
                <Button
                  variant="ghost"
                  className="justify-start text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
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

      {showNotifications && (
        <div
          className="fixed top-16 left-4 right-4 z-50 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg p-4 md:hidden"
          onClick={(e) => e.stopPropagation()} // Prevent clicks from closing parent elements
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 dark:text-white text-lg">
              Notifications
            </span>
            <button
              onClick={markAllNotificationsRead}
              disabled={unreadCount === 0 || notifLoading}
              className="text-sm text-blue-600 disabled:opacity-50"
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-44 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-center py-6">
                <Bell className="h-8 w-8 mx-auto mb-2" />
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`py-3 px-2 mb-1 rounded-lg cursor-pointer relative ${
                    !n.read ? "bg-blue-50 dark:bg-blue-950" : "bg-transparent"
                  }`}
                  onClick={() => {
                    setSelectedNotification(n);
                    setShowNotifModal(true);
                  }}
                >
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent modal from opening
                      handleDeleteNotification(n._id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                    aria-label="Delete notification"
                  >
                    <LucideX className="h-4 w-4 text-red-500" />
                  </button> */}
                  <p className="font-semibold text-gray-800 dark:text-white pr-6">
                    {n.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate pr-6">
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/95 via-purple-700/95 to-pink-600/95 dark:from-indigo-800/95 dark:via-purple-800/95 dark:to-pink-700/95" />
        <Meteors number={70} />

        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-4 mb-8">
              {/* <Sparkles className="h-12 w-12 text-amber-300 animate-pulse" /> */}
              <h1 className="font-poppins text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-zinc-200 to-purple-100 bg-clip-text text-transparent tracking-tight">
                EduHub
              </h1>
              {/* <Rocket className="h-12 w-12 text-amber-300 animate-bounce" /> */}
            </div>
            {showTextEffect && (
              <TextGenerateEffect
                words={"Your Ultimate Academic Resource Companion"}
              />
            )}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>Premium Quality Resources</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Trusted by Students</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Updated Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-16 relative z-10">
          <StatCard
            icon={BookOpen}
            title="Total Resources"
            value={stats.totalResources.toLocaleString()}
            description="Across all subjects"
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Users}
            title="Active Students"
            value={stats.activeStudents.toLocaleString()}
            description="Learning with us"
            gradient="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            icon={GitBranchIcon}
            title="Branches"
            value={stats.branches}
            description="Engineering streams"
            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            icon={BookmarkPlus}
            title="Subjects"
            value={stats.subjects}
            description="Available subjects"
            gradient="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-0 shadow-xl dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="mt-[-23px] p-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
              <Search className="h-6 w-5 mx-2 text-center" />
              Find Your Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Branch</option>
                  <option value="IT">Information Technology</option>
                  <option value="Computer">Computer Science</option>
                  <option value="AIML">Artificial Intelligence & ML</option>
                  <option value="Civil">Civil Engineering</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                  <option value="Electrical">Electrical Engineering</option>
                  <option value="Chemical">Chemical Engineering</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 dark:text-white"
                  disabled={noSubjects}
                >
                  {noSubjects ? (
                    <option value="">No subjects found</option>
                  ) : (
                    <>
                      <option value="">Select Subject</option>
                      {subjects.map((sub, idx) => (
                        <option key={idx} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  &nbsp;
                </label>
                <Button
                  onClick={handleSearch}
                  disabled={
                    !branch || !semester || !subject || loading || noSubjects
                  }
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Clock className="animate-spin h-5 w-5 mr-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Find Resources
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Section */}
        {branch && semester && subject && (
          <div className="space-y-8">
            {/* View Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Resources for {subject}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8 dark:bg-gray-800">
                <TabsTrigger
                  value="all"
                  className="dark:data-[state=active]:bg-gray-700"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="youtube"
                  className="dark:data-[state=active]:bg-gray-700"
                >
                  Videos
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="dark:data-[state=active]:bg-gray-700"
                >
                  Notes
                </TabsTrigger>
                <TabsTrigger
                  value="handwritten"
                  className="dark:data-[state=active]:bg-gray-700"
                >
                  Handwritten
                </TabsTrigger>
                <TabsTrigger
                  value="pyq"
                  className="dark:data-[state=active]:bg-gray-700"
                >
                  PYQs
                </TabsTrigger>
                <TabsTrigger
                  value="solutions"
                  className="dark:data-[state=active]:bg-gray-700"
                >
                  Solutions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-8">
                <ResourceSection
                  icon={Youtube}
                  title="YouTube Videos"
                  items={resources.youtube}
                  type="youtube"
                  gradient="bg-gradient-to-r from-red-500 to-red-600"
                />
                <ResourceSection
                  icon={FileText}
                  title="Handwritten Notes"
                  items={resources.handwritten}
                  type="handwritten"
                  gradient="bg-gradient-to-r from-orange-500 to-orange-600"
                />
                <ResourceSection
                  icon={BookOpen}
                  title="Online Notes & PPTs"
                  items={resources.notes}
                  type="notes"
                  gradient="bg-gradient-to-r from-green-500 to-green-600"
                />
                <ResourceSection
                  icon={FileText}
                  title="Previous Year Questions"
                  items={resources.pyq}
                  type="pyq"
                  gradient="bg-gradient-to-r from-blue-500 to-blue-600"
                />
                <ResourceSection
                  icon={BookOpen}
                  title="Question Solutions"
                  items={resources.solutions}
                  type="solutions"
                  gradient="bg-gradient-to-r from-purple-500 to-purple-600"
                />

                {/* Timetable Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Exam Timetables
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        All available for this semester
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {timetableResources.length === 0 ? (
                      <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                        <CardContent className="p-8 text-center">
                          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">
                            No timetable available yet
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Exam schedule will be posted here
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      timetableResources.map((tt, idx) => (
                        <Card
                          key={tt._id}
                          className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800"
                        >
                          <div className="h-2 bg-gradient-to-r from-pink-400 to-pink-600" />
                          <CardContent className="p-6">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {tt.title}{" "}
                              {tt.date && (
                                <span className="text-xs text-gray-400 ml-2">
                                  {tt.date}
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              Final Semester Examinations
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {tt.link && (
                                <Button
                                  asChild
                                  className="bg-pink-500 hover:bg-pink-600"
                                >
                                  <a
                                    href={tt.link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Eye className="h-4 w-4 mr-1" /> View Online
                                  </a>
                                </Button>
                              )}
                              {tt.fileUrl && (
                                <Button
                                  asChild
                                  variant="outline"
                                  className="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900 dark:hover:text-green-400"
                                >
                                  <a
                                    target="_blank"
                                    href={`${tt.fileUrl}`}
                                    download
                                  >
                                    <Download className="h-4 w-4 mr-1" />{" "}
                                    Download
                                  </a>
                                </Button>
                              )}
                            </div>
                            {tt.tableData && (
                              <div className="overflow-x-auto mt-4">
                                <table className="min-w-full border border-gray-300 rounded-lg text-xs md:text-sm">
                                  <thead>
                                    <tr className="bg-pink-100 dark:bg-pink-900">
                                      {tt.tableData.headers.map(
                                        (header, idx) => (
                                          <th
                                            key={idx}
                                            className="border p-2 font-bold text-pink-700 dark:text-pink-200"
                                          >
                                            {header}
                                          </th>
                                        )
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {tt.tableData.rows.map((row, rowIdx) => (
                                      <tr key={rowIdx}>
                                        {row.map((cell, cellIdx) => (
                                          <td
                                            key={cellIdx}
                                            className="border p-2"
                                          >
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="youtube">
                <ResourceSection
                  icon={Youtube}
                  title="YouTube Videos"
                  items={resources.youtube}
                  type="youtube"
                  gradient="bg-gradient-to-r from-red-500 to-red-600"
                />
              </TabsContent>

              <TabsContent value="notes">
                <ResourceSection
                  icon={BookOpen}
                  title="Online Notes & PPTs"
                  items={resources.notes}
                  type="notes"
                  gradient="bg-gradient-to-r from-green-500 to-green-600"
                />
              </TabsContent>

              <TabsContent value="handwritten">
                <ResourceSection
                  icon={FileText}
                  title="Handwritten Notes"
                  items={resources.handwritten}
                  type="handwritten"
                  gradient="bg-gradient-to-r from-orange-500 to-orange-600"
                />
              </TabsContent>

              <TabsContent value="pyq">
                <ResourceSection
                  icon={FileText}
                  title="Previous Year Questions"
                  items={resources.pyq}
                  type="pyq"
                  gradient="bg-gradient-to-r from-blue-500 to-blue-600"
                />
              </TabsContent>

              <TabsContent value="solutions">
                <ResourceSection
                  icon={BookOpen}
                  title="Question Solutions"
                  items={resources.solutions}
                  type="solutions"
                  gradient="bg-gradient-to-r from-purple-500 to-purple-600"
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewModal.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-80 rounded-2xl w-full h-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {previewModal.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Resource Preview
                </p>
              </div>
              <Button
                onClick={closePreview}
                variant="ghost"
                size="sm"
                className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full w-10 h-10 p-0"
              >
                <span className="text-2xl">×</span>
              </Button>
            </div>
            <div className="flex-1 p-4">
              {previewModal.type === "youtube" ? (
                <iframe
                  src={getYouTubeEmbedUrl(previewModal.url)}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              ) : (
                <iframe
                  src={previewModal.url}
                  className="w-full h-full border-0 rounded-lg"
                  title="PDF Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotifModal && selectedNotification && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeNotifModal}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
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
      {/* <Home /> */}
      {/* <footer className="bg-gray-100 dark:bg-gray-800 py-4 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} EduHub. All rights reserved.
        </p>
      </footer> */}
      <Footer />
    </div>
  );
}
