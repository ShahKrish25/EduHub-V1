"use client"
import { Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} EduHub. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">Developed by Krish Shah</span>
            <a 
              href="https://www.linkedin.com/in/krishshah09/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 