# 🎓 EduHub - One Stop Solution for College Students

EduHub is a full-stack web platform designed to provide semester-wise study resources, previous year question papers, AI-powered PDF understanding, and more — customized for engineering students across all branches.

---

## 🌐 Live URLs

| Layer         | Hosted At       | URL |
|---------------|-----------------|-----|
| 🎨 Frontend   | Vercel (vipkrish) | [https://edu-hub-v2.vercel.app](https://edu-hub-v2.vercel.app) |
| 🔧 Backend    | Vercel (vipkrish) | [https://edu-hub-v1.vercel.app](https://edu-hub-v1.vercel.app) |
| 🤖 AI Server  | Render (kvshah)   | [https://eduhub-v1-1.onrender.com](https://eduhub-v1-1.onrender.com) |

---

## 🚀 Features

- 📚 Upload and access branch-wise & semester-wise resources
- 🎥 YouTube video recommendations
- ✍️ Handwritten notes (PDF/Image)
- 📄 Online Notes / PDFs / PYQs / Solutions
- 📅 Semester Timetables (Admin uploaded)
- 🧠 AI PDF Assistant (with LLM support)
- 🗂️ Admin panel for managing all content
- 🧑‍🎓 Student login and role-based access
- 🔐 JWT Authentication

---

## ⚠️ Deployment Notes

- **Render AI Server Sleep Timeout**:
  - The AI server (Flask) hosted on Render sleeps after 15 minutes of inactivity.
  - First request after a long gap may take **30–40 seconds**.
  - If AI chat does not work, restart the Flask server from: [https://dashboard.render.com](https://dashboard.render.com)

- **MongoDB / API Call Limits**:
  - High traffic or multiple calls to MongoDB may temporarily cause **500 Internal Server Errors** on Vercel backend.
  - These usually resolve after a refresh or short wait.

- **Groq API Key Expiry**:
  - AI Chat uses Groq API for LLM inference.
  - Please **renew the API key** if AI chat shows: `"invalid api key"` or fails to respond.

---

## 🧪 Technologies Used

- **Frontend**: React, Next.js App Router, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB Atlas
- **AI Server**: Flask + Ollama/Groq LLM APIs
- **File Uploads**: Multer (local storage)
- **Authentication**: JWT-based secure login
- **Hosting**:
  - Vercel (frontend & backend)
  - Render (AI server)

---


## ⚠️ Admin Panel Access Note

The admin upload panel is currently **open to public access** for testing and demonstration purposes.

- Anyone can visit the Admin URL and upload resources.
- No login or role check is enforced on the frontend yet.

> ⚠️ This should be restricted in production using proper role-based access control (RBAC).

Planned improvements:
- Admin login page with JWT authentication
- Role-based UI rendering (student vs admin)
- Middleware protection on resource upload APIs





## 📌 Credentials (if needed for demo)

**👨‍🎓 Student**
- Email: kvshah25092005@gmail.com
- Password: 1234

---
## 📞 Contact

Created and maintained by **Krish Shah**  
> For any issues, contact: [ kvshah25092005@gmail.com **or** LinkedIn -> [krishshah09](https://www.linkedin.com/in/krishshah09/) ]

---
