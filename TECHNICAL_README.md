# Technical Documentation – Coditix Collaborative Code Editor

---

## 1. System Architecture

### Overview
Coditix is a fullstack real-time collaborative code editor. It consists of:
- **Frontend**: React SPA, CodeMirror editor, socket.io-client for real-time updates.
- **Backend**: Node.js/Express server, socket.io for WebSocket communication, in-memory state for rooms and code.
- **Communication**: WebSocket (Socket.IO) for all real-time events (join, code change, sync, disconnect).

### High-Level Diagram
```
[User 1]         [User 2]         [User N]
   |                 |                |
   |<-- WebSocket -->|<-- WebSocket-->|
   |                 |                |
        [Node.js + Express + Socket.IO Server]
```

---

## 2. File-by-File Breakdown

### Root
- `server.js`: Express server, Socket.IO logic, serves frontend build, manages rooms/users/code state.
- `render.yaml`: Render deployment config (build/start commands, env vars).
- `package.json`: Project metadata, dependencies, scripts.

### `/public`
- Static assets (images, icons, manifest, HTML shell).
- `manifest.json`: PWA metadata (name, icons, theme).
- `index.html`: Main HTML entry point for React app.

### `/src`
- `index.js`: React entry point, renders `<App />`.
- `App.js`: Main app layout, routing (Home, EditorPage), toast notifications.
- `App.css`: Main CSS, layout, theming, responsive design.
- `Actons.js`: Shared action constants for socket events (JOIN, CODE_CHANGE, etc).
- `socket.js`: Socket.io client setup, connection options.

#### `/src/components`
- `Editor.js`: CodeMirror-based collaborative code editor. Listens for code changes via socket, emits changes on edit.
- `Client.js`: Renders user avatar (color, initials) and username for connected users.

#### `/src/pages`
- `Home.js`: Room creation/join UI. Handles room ID and username input, navigation.
- `EditorPage.js`: Main collaborative editor page. Handles socket connection, user list, code sync, and editor rendering.

#### `/src/assets`
- Logos and images for branding/UI.

---

## 3. Key Flows & Logic

### Room Creation & Joining
- On Home page, user can create a new room (UUID) or enter an existing room ID.
- Username is required to join.
- On join, user is navigated to `/editor/:roomId` with username in state.

### Real-Time Collaboration
- On EditorPage mount:
  - Socket connects to backend.
  - Emits `JOIN` with roomId and username.
  - Server adds user to room, broadcasts `JOINED` to all clients in room.
  - If code exists for room, server sends latest code to new user.
- Code changes:
  - Editor emits `CODE_CHANGE` on every edit.
  - Server updates in-memory code for room, broadcasts to all other clients.
- Code sync:
  - When a new user joins, they request code sync from another client.
  - That client emits `SYNC_CODE` with current code, which is sent to the new user.
- User disconnect:
  - On disconnect, server removes user from room, broadcasts `DISCONNECTED`.
  - If room is empty, code is cleared from memory.

### User Management
- User list is managed via socket events (`JOINED`, `DISCONNECTED`).
- Each user is represented by a username and a socket ID.
- Avatars are generated with unique colors and initials.

---

## 4. Deployment & Configuration

### Local Development
- Install dependencies: `npm install`
- Start backend: `node server.js` (default port 5000)
- Start frontend: `npm run dev` (default port 5173)
- Environment variable `REACT_APP_BACKEND_URL` can override backend URL for frontend.

### Production (Render)
- `render.yaml` configures build/start commands and environment variables for Render.com.
- Static frontend is built and served by Express from the `build` directory.
- Health check path: `/`

---

## 5. UI/UX & Theming

- **Layout**: Responsive, flex/grid-based, dark theme.
- **Editor**: CodeMirror 6 with Dracula theme, JavaScript syntax highlighting.
- **User List**: Avatars with initials and color, live update on join/leave.
- **Notifications**: Toasts for join/leave/copy actions.
- **Branding**: Custom logo, favicon, and images.
- **Accessibility**: Keyboard navigation for input fields.

---

## 6. Extensibility & Contribution

### Extending Features
- Add more languages: Extend CodeMirror config in `Editor.js`.
- Add authentication: Integrate OAuth or custom auth in backend and pass tokens on socket connect.
- Persistent storage: Replace in-memory code/room state with a database (e.g., Redis, MongoDB).
- Add chat: Create a new component and socket event for chat messages.
- Add code execution: Integrate a code runner API and display results in the UI.

### Contribution Guidelines
- Fork the repo, create a feature branch, submit a pull request.
- Follow code style and naming conventions.
- Add comments and documentation for new features.
- Test thoroughly before submitting PRs.

---

## 7. File Relationships Diagram

```
Home.js <---(navigation)---> EditorPage.js
   |                              |
   |                              |
   v                              v
Actons.js <---(imported by)--- socket.js, server.js, Editor.js, EditorPage.js
   |                              |
   |                              |
   v                              v
Client.js, Editor.js <---(used by)--- EditorPage.js
```

---

## 8. Contact & Support

For technical questions, open an issue or contact the author:
- [GitHub](https://github.com/Aayushhh07)
- [Email](mailto:aayushvishwakarma93@gmail.com) 