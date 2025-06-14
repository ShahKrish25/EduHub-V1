"use client";
import { useRef, useState, useEffect } from "react";
import {
  Upload,
  Loader2,
  Send,
  FileText,
  MessageCircle,
  Bot,
  Files,
  X,
  RefreshCw,
  Trash2,
  Sparkles,
  Brain,
  BookOpen,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
const dotenv = require("dotenv");
export default function EnhancedAiToolsPage() {
  dotenv.config();
  // ... keep existing code (state declarations and useEffect)
  useEffect(() => {
    const token = localStorage.getItem("studyhub_token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    let id = window.sessionStorage.getItem("ai_session_id");
    if (!id) {
      id = Math.random().toString(36).substr(2, 9);
      window.sessionStorage.setItem("ai_session_id", id);
    }
    setSessionId(id);
  }, []);

  // File Upload State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Summary State
  const [summary, setSummary] = useState("");
  const [summaryType, setSummaryType] = useState("comprehensive");
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  // AI Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm your enhanced study assistant. Upload documents (PDF, images, Word, Excel, CSV) and I'll help you understand and analyze them. How can I help you today?",
    },
  ]);
  const chatEndRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  // Context State
  const [contextInfo, setContextInfo] = useState(null);

  // Theme State
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    // Load theme from localStorage or system
    const stored = localStorage.getItem("ai_theme");
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("ai_theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Maximize State
  const [maxChat, setMaxChat] = useState(false);
  const [maxSummary, setMaxSummary] = useState(false);

  // ... keep existing code (all handler functions)

  // File Upload Handlers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setUploadError("");
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));
      formData.append("session_id", sessionId);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_SERVER}upload-files`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.processed_files) {
        setUploadedFiles(
          data.processed_files.map((file) => ({
            ...file,
            size: Number(file.size), // Ensure size is a number
            upload_time: file.upload_time,
          }))
        );
        setContextInfo({
          files: data.processed_files,
          total_size: data.processed_files.reduce(
            (sum, f) => sum + Number(f.size || 0), // Use file.size, not file.metadata.size
            0
          ),
        });
        setSelectedFiles([]);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      } else {
        setUploadError(data.error || "Upload failed.");
      }
    } catch (err) {
      setUploadError("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const handleSummarize = async () => {
    if (uploadedFiles.length === 0) return;
    setSummarizing(true);
    setSummary("");
    setSummaryError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_SERVER}summarize-content`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, type: summaryType }),
        }
      );
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      } else {
        setSummaryError(data.error || "Failed to generate summary.");
      }
    } catch (err) {
      setSummaryError("Failed to generate summary. Please try again.");
    }
    setSummarizing(false);
  };

  const clearContext = async () => {
    setUploadedFiles([]);
    setSummary("");
    setContextInfo(null);
    setChatMessages([
      {
        sender: "ai",
        text: "Context cleared! Upload new documents and I'll help you analyze them.",
      },
    ]);
    await fetch(`${process.env.NEXT_PUBLIC_AI_SERVER}clear-context`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.file_id !== fileId));
    setContextInfo((prev) =>
      prev
        ? {
            ...prev,
            files: prev.files.filter((f) => f.file_id !== fileId),
          }
        : null
    );
  };

  // AI Chat Handlers (streaming)
  const handleSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: "user", text: chatInput };
    setChatMessages((msgs) => [...msgs, userMsg]);
    setChatLoading(true);
    setStreaming(true);
    setChatInput("");
    let aiMsg = { sender: "ai", text: "" };
    setChatMessages((msgs) => [...msgs, aiMsg]);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AI_SERVER}chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, session_id: sessionId }),
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      let done = false;
      let fullText = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = value ? new TextDecoder().decode(value) : "";
        fullText += chunk;
        setChatMessages((msgs) => {
          const updated = [...msgs];
          updated[updated.length - 1] = { sender: "ai", text: fullText };
          return updated;
        });

        // Scroll as new content streams in
        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
    } catch {
      setChatMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: "Server error. Please try again." },
      ]);
    }
    setChatLoading(false);
    setStreaming(false);
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getSupportedFileTypes = () => {
    return "PDF, Images (JPG, PNG, etc.), Word Documents, Excel Files, CSV, Text Files";
  };

  const formatFileSize = (bytes) => {
    if (typeof bytes !== "number" || isNaN(bytes) || bytes < 0) return "0 B"; // Fallback for invalid sizes
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (!sessionId)
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-gray-300">
          <Loader2 className="animate-spin h-6 w-6" />
          Initializing session...
        </div>
      </div>
    );

  const placeholders = [
    "Summarize this document...",
    "Explain this concept...",
    "Generate questions from this...",
    "Create a mind map...",
    "Find key points...",
  ];
  const handleChange = (e) => {
    console.log(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header (compact) */}
      <div
        className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-800/40 sticky top-0 z-50 ${
          maxChat || maxSummary ? "hidden" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <a href="/">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">EduHub</h1>
            </div>
          </a>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
        <div className="text-center pb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload multiple documents, get intelligent summaries, and chat with
            context-aware AI
          </p>
          <div className="flex items-center justify-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <FileText className="h-3 w-3" />
            <span>Supports: {getSupportedFileTypes()}</span>
          </div>
        </div>
      </div>

      <div
        className={`max-w-[100lvw] mx-auto md:px-4 md:py-8 md:space-y-8 px-2 py-2 ${
          maxChat || maxSummary ? "hidden" : ""
        }`}
      >
        {/* Context Info Bar */}
        {contextInfo && contextInfo.files.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/50 md:mb-0 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <Files className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
                    Active Session
                  </h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">
                    {contextInfo.files.length} files •{" "}
                    {formatFileSize(contextInfo.total_size)}
                  </p>
                </div>
              </div>
              <button
                onClick={clearContext}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - File Upload & Summary */}
          <div className="space-y-8">
            {/* ... keep existing code (File Upload Section) */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-xl p-2 md:p-8 border border-white/20 dark:border-gray-800/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Document Upload
                </h2>
              </div>

              <div className="space-y-6">
                {/* File Selection */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                        <Upload className="h-8 w-8 text-blue-500" />
                      </div>
                    </div>
                    <div>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff,.docx,.xlsx,.xls,.csv,.txt"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                          Choose files to upload
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          or drag and drop them here
                        </p>
                      </label>
                    </div>
                    {selectedFiles.length > 0 && (
                      <button
                        onClick={handleFileUpload}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-5 w-5" />
                            Upload {selectedFiles.length} file
                            {selectedFiles.length > 1 ? "s" : ""}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* ... keep existing code (Selected Files Preview, Upload Error, Uploaded Files List) */}
                {selectedFiles.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4">
                    <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">
                      Selected Files:
                    </h4>
                    <div className="space-y-2">
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3"
                        >
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-gray-700 dark:text-gray-200 truncate flex-1">
                            {file.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5" />
                      <span className="font-medium">{uploadError}</span>
                    </div>
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl p-6">
                    <h3 className="font-semibold text-lg mb-4 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                      <Files className="h-5 w-5" />
                      Uploaded Files ({uploadedFiles.length})
                    </h3>
                    <div className="space-y-3">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.file_id}
                          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {file.filename}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatFileSize(file.size)} •{" "}
                                  {new Date(file.upload_time).toLocaleString(
                                    "en-US",
                                    {
                                      hour: "numeric",
                                      minute: "numeric",
                                      hour12: true,
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(file.file_id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Summary Section */}
            {uploadedFiles.length > 0 && !maxSummary && (
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-xl p-2 py-5 md:p-8 border border-white/20 dark:border-gray-800/40">
                <button
                  onClick={() => setMaxSummary(true)}
                  className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label="Maximize"
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
                {/* ... keep existing code (Summary content) */}
                <div className="flex items-center gap-3 mb-6 md:px-0 px-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                    <Sparkles className="md:h-6 md:w-6 h-4 w-4 text-white" />
                  </div>
                  <h2 className="md:text-2xl text-xl font-bold text-gray-800 dark:text-gray-100">
                    Smart Summary
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Summary Controls */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      value={summaryType}
                      onChange={(e) => setSummaryType(e.target.value)}
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="comprehensive">
                        Comprehensive Summary
                      </option>
                      <option value="brief">Brief Overview</option>
                      <option value="key-points">Key Points Only</option>
                      <option value="academic">Academic Focus</option>
                    </select>
                    <button
                      onClick={handleSummarize}
                      disabled={summarizing}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                    >
                      {summarizing ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-5 w-5" />
                          Generate
                        </>
                      )}
                    </button>
                  </div>

                  {/* Summary Display */}
                  {summary && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 max-h-96 overflow-y-auto prose max-w-none break-words whitespace-pre-wrap text-sm sm:text-base">
                      <div className="prose max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: (props) => (
                              <h1
                                className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-200"
                                {...props}
                              />
                            ),
                            h2: (props) => (
                              <h2
                                className="text-xl font-semibold mb-3 text-purple-700 dark:text-purple-300"
                                {...props}
                              />
                            ),
                            h3: (props) => (
                              <h3
                                className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400"
                                {...props}
                              />
                            ),
                            p: (props) => (
                              <p
                                className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed"
                                {...props}
                              />
                            ),
                            ul: (props) => (
                              <ul className="mb-3 pl-5 space-y-1" {...props} />
                            ),
                            ol: (props) => (
                              <ol className="mb-3 pl-5 space-y-1" {...props} />
                            ),
                            li: (props) => (
                              <li
                                className="text-gray-700 dark:text-gray-300"
                                {...props}
                              />
                            ),
                            strong: (props) => (
                              <strong
                                className="font-semibold text-purple-800 dark:text-purple-200"
                                {...props}
                              />
                            ),
                            em: (props) => (
                              <em
                                className="italic text-purple-700 dark:text-purple-300"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {summary}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {summaryError && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <X className="h-5 w-5" />
                        <span className="font-medium">{summaryError}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - AI Chat */}
          <div
            className={`relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 dark:border-gray-800/40 flex flex-col h-fit lg:sticky lg:top-24 transition-all duration-500 ease-in-out ${
              maxChat ? "lg:col-span-2" : ""
            }`}
          >
            {/* Maximize/Restore Button */}
            <button
              onClick={() => setMaxChat((v) => !v)}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label={maxChat ? "Restore" : "Maximize"}
            >
              {maxChat ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>
            <div className="flex items-center gap-3 md:p-8 md:pb-6 p-6">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl">
                <MessageCircle className="md:h-6 md:w-6 h-4 w-4 text-white" />
              </div>
              <h2 className="md:text-2xl text-xl font-bold text-gray-800 dark:text-gray-100">
                AI Chat
              </h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 md:px-8 md:pb-6 px-1 pb-2">
              <div
                className={`bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl p-1 px-2 overflow-y-auto ${
                  maxChat ? "h-[calc(100vh-240px)]" : "md:h-96 h-[80vh]"
                }`}
              >
                {/* ... keep existing code (chat messages rendering) */}
                <div className="space-y-6">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[99%] ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl rounded-br-md px-4 py-3"
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md md:px-2 px-2 py-2 shadow-sm"
                        }`}
                      >
                        {msg.sender === "ai" ? (
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  h1: (props) => (
                                    <h1
                                      className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2"
                                      {...props}
                                    />
                                  ),
                                  h2: (props) => (
                                    <h2
                                      className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200"
                                      {...props}
                                    />
                                  ),
                                  h3: (props) => (
                                    <h3
                                      className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
                                      {...props}
                                    />
                                  ),
                                  p: (props) => (
                                    <p
                                      className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                                      {...props}
                                    />
                                  ),
                                  ul: (props) => (
                                    <ul
                                      className="mb-3 pl-4 space-y-1 text-sm"
                                      {...props}
                                    />
                                  ),
                                  ol: (props) => (
                                    <ol
                                      className="mb-3 pl-4 space-y-1 text-sm list-decimal"
                                      {...props}
                                    />
                                  ),
                                  li: (props) => (
                                    <li
                                      className="text-gray-700 dark:text-gray-300 list-disc"
                                      {...props}
                                    />
                                  ),
                                  code: (props) => {
                                    const { children, className } = props;
                                    const isInline =
                                      !className?.includes("language-");

                                    if (!isInline) {
                                      return (
                                        <div className="my-3">
                                          <pre className="bg-gray-900 text-green-300 rounded-lg p-3 overflow-x-auto text-xs">
                                            <code {...props}>{children}</code>
                                          </pre>
                                        </div>
                                      );
                                    }
                                    return (
                                      <code
                                        className="bg-gray-100 dark:bg-gray-700 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded text-xs font-mono"
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    );
                                  },
                                  table: (props) => (
                                    <div className="my-3 overflow-x-auto">
                                      <table
                                        className="min-w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg"
                                        {...props}
                                      />
                                    </div>
                                  ),
                                  th: (props) => (
                                    <th
                                      className="border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left text-gray-700 dark:text-gray-300"
                                      {...props}
                                    />
                                  ),
                                  td: (props) => (
                                    <td
                                      className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300"
                                      {...props}
                                    />
                                  ),
                                  a: (props) => (
                                    <a
                                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      {...props}
                                    />
                                  ),
                                  strong: (props) => (
                                    <strong
                                      className="font-semibold text-gray-900 dark:text-gray-100"
                                      {...props}
                                    />
                                  ),
                                  em: (props) => (
                                    <em
                                      className="italic text-gray-600 dark:text-gray-400"
                                      {...props}
                                    />
                                  ),
                                  blockquote: (props) => (
                                    <blockquote
                                      className="border-l-4 border-blue-400 pl-4 py-2 my-3 bg-blue-50 dark:bg-blue-900/30 italic text-gray-700 dark:text-gray-300"
                                      {...props}
                                    />
                                  ),
                                }}
                              >
                                {msg.text}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm font-medium">{msg.text}</div>
                        )}
                      </div>
                    </div>
                  ))}

                  {streaming && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                            <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              AI is thinking...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    onChange={(e) => setChatInput(e.target.value)}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (chatInput.trim() && !chatLoading && !streaming) {
                        handleSend();
                      }
                    }}
                  />

                  {/* <button
                    onClick={handleSend}
                    disabled={!chatInput.trim() || chatLoading || streaming}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {chatLoading || streaming ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button> */}
                </div>

                {/* Chat Help Text */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                          💡 Try asking:
                        </p>
                        <p className="text-blue-700 dark:text-blue-300">
                          "Summarize the main points", "What are the key
                          concepts?", "Create study questions", "Explain this
                          topic in simple terms"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-white/20 dark:border-gray-700/40">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Session: {sessionId}
            </span>
          </div>
        </div>
      </div>

      {/* Maximized Chat */}
      {maxChat && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-scale-in">
          <div className="h-screen flex flex-col">
            {/* Header for Maximized Chat */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-800/40 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl">
                    <MessageCircle className="md:h-6 md:w-6 h-4 w-4 text-white" />
                  </div>
                  <h2 className="md:text-2xl text-xl font-bold text-gray-800 dark:text-gray-100">
                    AI Chat
                  </h2>
                </div>
                <button
                  onClick={() => setMaxChat(false)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label="Minimize"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Content - Fixed height container */}
            <div className="flex-1 p-2 md:p-6 flex flex-col min-h-0">
              {/* Messages Container - Scrollable */}
              <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl md:p-4 p-2 flex-1 overflow-y-auto mb-4">
                {/* ... keep existing code (chat messages rendering for maximized view) */}
                <div className="space-y-4">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[99%] sm:max-w-[85%] ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl rounded-br-md px-2 py-2 md:px-4 md:py-3"
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-2 py-3 shadow-sm"
                        }`}
                      >
                        {msg.sender === "ai" ? (
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-1 flex md:block">
                              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  h1: (props) => (
                                    <h1
                                      className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2"
                                      {...props}
                                    />
                                  ),
                                  h2: (props) => (
                                    <h2
                                      className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200"
                                      {...props}
                                    />
                                  ),
                                  h3: (props) => (
                                    <h3
                                      className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
                                      {...props}
                                    />
                                  ),
                                  p: (props) => (
                                    <p
                                      className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                                      {...props}
                                    />
                                  ),
                                  ul: (props) => (
                                    <ul
                                      className="mb-3 pl-4 space-y-1 text-sm"
                                      {...props}
                                    />
                                  ),
                                  ol: (props) => (
                                    <ol
                                      className="mb-3 pl-4 space-y-1 text-sm list-decimal"
                                      {...props}
                                    />
                                  ),
                                  li: (props) => (
                                    <li
                                      className="text-gray-700 dark:text-gray-300 list-disc"
                                      {...props}
                                    />
                                  ),
                                  code: (props) => {
                                    const { children, className } = props;
                                    const isInline =
                                      !className?.includes("language-");

                                    if (!isInline) {
                                      return (
                                        <div className="my-3">
                                          <pre className="bg-gray-900 text-green-300 rounded-lg p-3 overflow-x-auto text-xs">
                                            <code {...props}>{children}</code>
                                          </pre>
                                        </div>
                                      );
                                    }
                                    return (
                                      <code
                                        className="bg-gray-100 dark:bg-gray-700 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded text-xs font-mono"
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    );
                                  },
                                  table: (props) => (
                                    <div className="my-3 overflow-x-auto">
                                      <table
                                        className="min-w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg"
                                        {...props}
                                      />
                                    </div>
                                  ),
                                  th: (props) => (
                                    <th
                                      className="border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left text-gray-700 dark:text-gray-300"
                                      {...props}
                                    />
                                  ),
                                  td: (props) => (
                                    <td
                                      className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300"
                                      {...props}
                                    />
                                  ),
                                  a: (props) => (
                                    <a
                                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      {...props}
                                    />
                                  ),
                                  strong: (props) => (
                                    <strong
                                      className="font-semibold text-gray-900 dark:text-gray-100"
                                      {...props}
                                    />
                                  ),
                                  em: (props) => (
                                    <em
                                      className="italic text-gray-600 dark:text-gray-400"
                                      {...props}
                                    />
                                  ),
                                  blockquote: (props) => (
                                    <blockquote
                                      className="border-l-4 border-blue-400 pl-4 py-2 my-3 bg-blue-50 dark:bg-blue-900/30 italic text-gray-700 dark:text-gray-300"
                                      {...props}
                                    />
                                  ),
                                }}
                              >
                                {msg.text}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm font-medium">{msg.text}</div>
                        )}
                      </div>
                    </div>
                  ))}

                  {streaming && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                            <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              AI is thinking...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Chat Input - Fixed at bottom */}
              <div className="space-y-4 flex-shrink-0">
                <div className="flex gap-3">
                  <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (chatInput.trim() && !chatLoading && !streaming) {
                        handleSend();
                      }
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !chatLoading &&
                      !streaming &&
                      handleSend()
                    }
                    disabled={chatLoading || streaming}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-100 dark:disabled:bg-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Chat Help Text for Maximized View */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                          💡 Try asking:
                        </p>
                        <p className="text-blue-700 dark:text-blue-300">
                          "Summarize the main points", "What are the key
                          concepts?", "Create study questions", "Explain this
                          topic in simple terms"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maximized Summary */}
      {maxSummary && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-scale-in">
          <div className="h-screen flex flex-col">
            {/* Header for Maximized Summary */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-800/40 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Smart Summary
                  </h2>
                </div>
                <button
                  onClick={() => setMaxSummary(false)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label="Minimize"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Summary Content - Fixed height container */}
            <div className="flex-1 p-2 md:p-6 flex flex-col min-h-0">
              {/* Summary Controls - Fixed at top */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4 flex-shrink-0">
                <select
                  value={summaryType}
                  onChange={(e) => setSummaryType(e.target.value)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="comprehensive">Comprehensive Summary</option>
                  <option value="brief">Brief Overview</option>
                  <option value="key-points">Key Points Only</option>
                  <option value="academic">Academic Focus</option>
                </select>
                <button
                  onClick={handleSummarize}
                  disabled={summarizing}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  {summarizing ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      Generate
                    </>
                  )}
                </button>
              </div>

              {/* Summary Display - Scrollable */}
              {summary && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 flex-1 overflow-y-auto prose max-w-none break-words whitespace-pre-wrap text-sm sm:text-base">
                  <div className="prose max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: (props) => (
                          <h1
                            className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-200"
                            {...props}
                          />
                        ),
                        h2: (props) => (
                          <h2
                            className="text-xl font-semibold mb-3 text-purple-700 dark:text-purple-300"
                            {...props}
                          />
                        ),
                        h3: (props) => (
                          <h3
                            className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400"
                            {...props}
                          />
                        ),
                        p: (props) => (
                          <p
                            className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed"
                            {...props}
                          />
                        ),
                        ul: (props) => (
                          <ul className="mb-3 pl-5 space-y-1" {...props} />
                        ),
                        ol: (props) => (
                          <ol className="mb-3 pl-5 space-y-1" {...props} />
                        ),
                        li: (props) => (
                          <li
                            className="text-gray-700 dark:text-gray-300"
                            {...props}
                          />
                        ),
                        strong: (props) => (
                          <strong
                            className="font-semibold text-purple-800 dark:text-purple-200"
                            {...props}
                          />
                        ),
                        em: (props) => (
                          <em
                            className="italic text-purple-700 dark:text-purple-300"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {summary}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {summaryError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <X className="h-5 w-5" />
                    <span className="font-medium">{summaryError}</span>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!summary && !summaryError && !summarizing && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-4 inline-block">
                      <Sparkles className="h-8 w-8 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Generate Your Summary
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Click the Generate button to create an intelligent summary
                      of your uploaded documents.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes scale-in {
          0% { 
            transform: scale(0.8); 
            opacity: 0; 
          }
          100% { 
            transform: scale(1); 
            opacity: 1; 
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <footer className="bg-gray-100 dark:bg-gray-800 py-4 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} EduHub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
