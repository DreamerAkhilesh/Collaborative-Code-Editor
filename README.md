# Coditix – Realtime Collaborative Code Editor



**Coditix** is a fullstack real-time collaborative code editor that allows multiple users to join a shared room and edit code together with instant synchronization. Built with modern web technologies, it enables seamless live collaboration, making it ideal for coding interviews, teaching, pair programming, and hackathons.

---

## 🚀 Live Demo

👉 [Try Coditix Live](https://collaborative-code-editor-rho.vercel.app/)

> ⚙️ Backend hosted on [Render](https://coditix.onrender.com/)  
> 🌐 Frontend hosted on [Vercel](https://collaborative-code-editor-rho.vercel.app/)

---

## 🛠️ Tech Stack

### 🔹 Frontend
- **React** (with Hooks)
- **CodeMirror 6** (via `@uiw/react-codemirror`)
- **React Router v7**
- **UUID** (for room IDs)
- **React Hot Toast** (notifications)
- **Tailwind CSS** (optional for styling)

### 🔸 Backend
- **Node.js**
- **Express.js**
- **Socket.IO** (WebSocket-based communication)

---

## 📂 Project Structure
```
realtime-editor/
├── build/ # Production build
├── node_modules/ # Dependencies
├── public/ # Static assets (favicon, manifest)
├── src/
│ ├── assets/ # Logos and images
│ ├── components/ # Reusable UI components (Editor, ClientList)
│ ├── pages/ # React pages (Home, EditorPage)
│ ├── App.js # App layout and routing
│ └── index.js # Entry point
├── server.js # Express + Socket.IO backend
├── render.yaml # Render deployment config
├── .gitignore
├── .nvmrc # Node version config
├── package.json
├── package-lock.json
└── README.md
```


---

## ✨ Features

- 🔄 **Real-time code collaboration** using WebSockets
- 🔗 **Create or join rooms** with unique Room IDs
- 👥 **Live user list** with avatars
- 📋 **Copy/share Room ID** with one click
- 🔔 **Toast notifications** on user actions
- ⚡ **Instant code synchronization** across all clients

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aayushhh07/Collaborative-Code-Editor.git
cd Collaborative-Code-Editor
```

### 2. Frontend
```bash
cd realtime-editor
npm install
```

### 3. Backend
```bash
npm install
```

### 4. Run locally 

Start Backend Server (Port 5000 by default)
```bash
node server.js
```
Start Frontend Dev Server (Port 5173 by default)
```bash
cd Collaborative-Code-Editor
npm run dev
```

npm run dev





