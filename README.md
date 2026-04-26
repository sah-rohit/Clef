# 🎹 CLEF
> **By Sonata Interactive**

![Clef Dashboard](./screenshots/Screenshot%202026-04-26%20073638.png)

### [🚀 LIVE DEMO: GETCLEF.NETLIFY.APP](https://getclef.netlify.app/)

**CLEF** is a high-fidelity, brutalist workbench designed for creators, developers, and power users who value speed and efficiency. It consolidates fragmented web utilities into a single, lightning-fast "Daily Workbench."

---

## 🎯 THE MISSION

### WHAT IS CLEF?
Clef is a unified productivity hub that provides professional-grade tools for text manipulation, code execution, data formatting, and AI assistance. Everything is designed to be accessible within two clicks.

### WHO IS IT FOR?
- **Developers**: Who need a quick, distraction-free environment to format JSON, test CSS snippets, or generate UUIDs.
- **Writers**: Who want a minimalist "Text Forge" for drafting without the clutter of traditional word processors.
- **Power Users**: Who want an AI assistant that respects speed and provides clean, logical responses.

---

## 🔒 PRIVACY & SECURITY

Clef is built with a **Privacy-First** mindset. 

### TWO MODES, TWO TRUST LEVELS

**Guest Mode (default)** — runs entirely in your browser. No accounts, no tracking, no data leaves your device. All tool state and AI chat history are stored in `localStorage` only.

**Logged-In Mode** — unlocks cross-device sync via [Convex](https://www.convex.dev/). Your profile and chat history are stored in the cloud with AES-256 encryption. You opt into this explicitly by signing in.

### 🔒 PROTOCOLS
- **No Cookies/Analytics**: We use zero third-party tracking or invasive analytics.
- **Local Storage Sovereignty**: Guest data is stored entirely on your device.
- **Secure Cloud Sync**: Logged-in users benefit from AES-256 encrypted storage via Convex for their profiles and chat history.
- **Clean Backend**: All AI requests are handled through our secure serverless worker, ensuring your interaction data remains ephemeral and safe.

---

## 🤖 CLEF AI: THE LOGIC ENGINE
![Clef AI Integration](./screenshots/Screenshot%202026-04-26%20073746.png)

Clef features an integrated AI assistant powered by the **Llama 3.1** model. It is optimized for logical tasks, code debugging, and text synthesis.

### 🌟 SMART FEATURES
- **Saved History**: Access previous conversations via the **Local Chat Archive** (History button) or cloud sync.
- **Compact UI**: Optimized, minimalist interface that puts logic first.
- **One-Click Retry**: Instantly regenerate responses with the "Retry" button.

---

## 🧰 THE TOOLSET

### ✍️ TEXT FORGE
![Text Forge](./screenshots/Screenshot%202026-04-26%20073701.png)
A distraction-free writing environment with real-time word/character counting and instant local downloads.

### 💻 CODE WORKBENCH
![Code Workbench](./screenshots/Screenshot%202026-04-26%20073728.png)
Run and format JavaScript, HTML, CSS, JSON, and SQL directly in the browser. Perfect for testing logic before implementation.

---

## 🏗️ TECH STACK
- **FRONTEND**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **BACKEND**: [Convex](https://www.convex.dev/) (Serverless Real-time Database)
- **AUTH**: [Convex Auth](https://labs.convex.dev/auth)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **AI**: Llama 3.1 via Groq

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
3. Set your Groq key in Convex: `npx convex env set GROQ_API_KEY your_key_here`

---

## ⚖️ LICENSE
Distributed under the **MIT License**. See `LICENSE` for more information.

**Built with 🖤 by Rohit Sah for Sonata Interactive**
