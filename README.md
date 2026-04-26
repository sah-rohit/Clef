# 🎹 CLEF
> **By Sonata Interactive**

![Clef Dashboard](./screenshots/Screenshot%202026-04-26%20073638.png)

### [🚀 LIVE DEMO: GETCLEF.NETLIFY.APP](https://getclef.netlify.app/)

**CLEF** is a high-fidelity, brutalist workbench containing essential utilities for developers and creators. Built for speed, privacy, and simplicity, it provides a unified space for code, text, and data manipulation—running entirely in your browser with zero data tracking.

---

## 🖼️ GALLERY

### 🤖 AI INTERFACE
![Clef AI Integration](./screenshots/Screenshot%202026-04-26%20073746.png)
*Secure, server-side AI logic via Groq Engine.*

### ✍️ TEXT FORGE
![Text Forge](./screenshots/Screenshot%202026-04-26%20073701.png)
*Distraction-free writing and text processing.*

### 💻 CODE WORKBENCH
![Code Workbench](./screenshots/Screenshot%202026-04-26%20073728.png)
*Real-time code execution and formatting.*

---

## 🛠️ THE ARCHITECTURE
Clef is designed with a **Brutalist Aesthetic** to maximize focus and minimize bloat. It consolidates fragmented web tools into a single, lightning-fast platform.

### ⚡ CORE FEATURES
- **UTILITY FORGE**: Real-time code execution, JSON formatting, markdown editing, and text generators.
- **CLEF AI**: Advanced logic engines powered by Llama 3.1, secured via Convex backend actions.
- **ACCOUNT CENTER**: Secure cloud-synced profiles and session management.
- **GUEST MODE**: Full tool access without account creation (Local Storage persistence).

---

## 🏗️ TECH STACK
- **FRONTEND**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **BACKEND**: [Convex](https://www.convex.dev/) (Serverless Real-time Database)
- **AUTH**: [Convex Auth](https://labs.convex.dev/auth)
- **STYLING**: Vanilla CSS (Custom Design System)

---

## 🚀 LOCAL SETUP

### 1. CLONE THE REPO
```bash
git clone https://github.com/sah-rohit/clef.git
cd clef
```

### 2. INSTALL DEPENDENCIES
```bash
npm install
```

### 3. CONFIGURE ENVIRONMENT
1. Copy the example environment file: `cp .env.example .env.local`
2. Update `VITE_CONVEX_URL` with your Convex deployment URL.
3. For AI features, set your Groq key in Convex: `npx convex env set GROQ_API_KEY your_key_here`

### 4. RUN DEV
```bash
npx convex dev
# In a new terminal
npm run dev
```

---

## 🛡️ SECURITY & PRIVACY
- **ZERO TRACKING**: No third-party trackers or invasive analytics.
- **SECURE API HANDOFF**: All sensitive AI logic is handled via Convex Actions on the server, ensuring API keys are never exposed to the client.
- **DATA FREEDOM**: Export your entire profile data as JSON at any time.

---

## 🤖 DEVELOPMENT NOTE
This project was developed with the assistance of advanced AI modeling to ensure logical consistency and rapid iteration, while maintaining a strictly human-led design philosophy and aesthetic vision.

---

## ⚖️ LICENSE
Distributed under the **MIT License**. See `LICENSE` for more information.

**Built with 🖤 by Rohit Sah for Sonata Interactive**
