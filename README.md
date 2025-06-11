# 🎓 EduHub - One Stop Solution for College Students

EduHub is a full-stack web platform designed to provide semester-wise study resources, previous year question papers, AI-powered PDF understanding, and more — customized for engineering students across all branches.

---

## 🌐 Live URLs

| Layer         | Hosted At       | URL |
|---------------|-----------------|-----|
| 🎨 Frontend   | Vercel (vipkrish) | [https://edu-hub-v2.vercel.app](https://edu-hub-v2.vercel.app) |
| 🔧 Backend    | Vercel (vipkrish) | [https://edu-hub-v1.vercel.app](https://edu-hub-v1.vercel.app) |
| 🔧 Backend v2 *(**active**)*    | Render (kvshah) | [https://eduhub-v1.onrender.com](https://edu-hub-v1.vercel.app) |
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

* **Render Server Sleep Timeout**:

  * Both the **backend** and **AI server** are hosted on **Render.com**, which puts free-tier services to sleep after 15 minutes of inactivity.
  * The **first request after a long idle period** may take **30–40 seconds** to respond.
  * To **keep the servers awake**, a **cron job** is configured using [UptimeRobot.com](https://uptimerobot.com) to send a simple `GET` request every **13 minutes**, preventing the servers from going idle.

* **MongoDB / API Call Limits**:

  * Under high usage, calls to MongoDB may trigger **500 Internal Server Errors** on the backend.
  * Usually resolved with a browser refresh or short wait.

* **Groq API Key Expiry**:

  * The AI Chat feature relies on the **Groq API** for LLM responses.
  * If the chat stops working or shows `"invalid api key"`, the key may have expired and needs to be **renewed**.

---

## 🧪 Technologies Used

- **Frontend**: React, Next.js App Router, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB Atlas
- **AI Server**: Flask + Ollama/Groq LLM APIs
- **File Uploads**: Multer (local storage)
- **Authentication**: JWT-based secure login
- **Hosting**:
  - Vercel (frontend)
  - Render (AI server, backend)
  - cron jobs (upTimeRobot)

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
