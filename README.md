# 🎹 CLEF
> **By Sonata Interactive**

![Clef Dashboard](./screenshots/Screenshot%202026-04-26%20073638.png)

### [🚀 LIVE DEMO: GETCLEF.NETLIFY.APP](https://getclef.netlify.app/)

**CLEF** is a high-fidelity, brutalist workbench designed for creators, developers, and power users who value speed and privacy over bloated interfaces. It consolidates fragmented web utilities into a single, lightning-fast "Daily Workbench."

---

## 🎯 THE MISSION

### WHAT IS CLEF?
Clef is a unified productivity hub that provides professional-grade tools for text manipulation, code execution, data formatting, and AI assistance. Everything is designed to be accessible within two clicks.

### WHO IS IT FOR?
- **Developers**: Who need a quick, distraction-free environment to format JSON, test CSS snippets, or generate UUIDs.
- **Writers**: Who want a minimalist "Text Forge" for drafting without the clutter of traditional word processors.
- **Power Users**: Who want an AI assistant that respects privacy and runs on high-performance logic engines.

### WHY IS IT DIFFERENT?
- **Brutalist UX**: No gradients, no rounded corners, no nonsense. Just high-contrast efficiency.
- **Privacy First**: Most tools run 100% locally in your browser. Your data never touches a server unless you explicitly save it to your cloud profile.
- **Zero Friction**: No forced accounts. Guest mode is a first-class citizen.

---

## 🤖 CLEF AI: THE LOGIC ENGINE
![Clef AI Integration](./screenshots/Screenshot%202026-04-26%20073746.png)

Clef features an integrated AI assistant powered by the **Llama 3.1 (8B)** model via the **Groq Engine**. Unlike typical chatbots, Clef AI is designed for logical tasks, code debugging, and text synthesis.

### 🛡️ SECURE ARCHITECTURE
We use **Convex Backend Actions** to handle AI requests. This means your interaction is processed through our secure server layer—keeping API keys hidden and ensuring your data isn't used for training third-party models.

### ⏳ USAGE LIMITS (FREE TIER)
To ensure high-speed access for everyone, Clef AI operates on a fair-use model:
- **10 Requests per Hour**
- **50 Requests per Day**
*Limits are reset automatically based on your session timestamp.*

---

## 🧰 THE TOOLSET

### ✍️ TEXT FORGE
![Text Forge](./screenshots/Screenshot%202026-04-26%20073701.png)
A distraction-free writing environment with real-time word/character counting and instant local downloads.

### 💻 CODE WORKBENCH
![Code Workbench](./screenshots/Screenshot%202026-04-26%20073728.png)
Run and format JavaScript, HTML, CSS, JSON, and SQL directly in the browser. Perfect for testing logic before implementation.

### 🛠️ UTILITY HUB
- **Data Forge**: JSON Formatter, UUID Generator, Base64 Converter.
- **Color Engine**: HEX/RGB/HSL conversion with visual previews.
- **Logic Tools**: Regex tester and Markdown previewer.

---

## 🏗️ TECH STACK
- **FRONTEND**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **BACKEND**: [Convex](https://www.convex.dev/) (Serverless Real-time Database)
- **AUTH**: [Convex Auth](https://labs.convex.dev/auth)
- **STYLING**: Vanilla CSS (Custom Brutalist Design System)

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
3. To enable AI features locally, set your Groq key in Convex: `npx convex env set GROQ_API_KEY your_key_here`

---

## 🛡️ PRIVACY POLICY
- **NO COOKIES**: We don't use cookies for tracking.
- **NO ANALYTICS**: We don't use Google Analytics or third-party tracking scripts.
- **LOCAL FIRST**: Your "Guest Mode" data stays in your browser's LocalStorage.

---

## 🤖 DEVELOPMENT NOTE
This project was developed with the assistance of advanced AI modeling to ensure logical consistency and rapid iteration, while maintaining a strictly human-led design philosophy and aesthetic vision.

---

## ⚖️ LICENSE
Distributed under the **MIT License**. See `LICENSE` for more information.

**Built with 🖤 by Rohit Sah for Sonata Interactive**
