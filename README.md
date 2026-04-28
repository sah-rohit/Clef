# 🎹 CLEF

> **The Brutalist Productivity Suite**

![Clef Dashboard](./screenshots/Screenshot%202026-04-26%20073638.png)

### [🚀 LIVE DEMO: CLEF.PAGES.DEV](https://clef.pages.dev/)

**CLEF** is a high-fidelity, brutalist workbench designed for creators, developers, and power users who value speed and aesthetic intensity. It consolidates fragmented web utilities into a single, lightning-fast "Daily Workbench."

---

## 🏗️ THE ARCHITECTURE

Clef has evolved into a multi-page standalone suite, designed for maximum focus and deep-linking efficiency.

### 🧰 TOOLS 2.0

Our tools are now categorized into dedicated blocks:

- **DEVELOPER**: JSON Formatter, Regex Tester, UUID Generator, Code IDE, etc.
- **PRODUCTIVITY**: Markdown Editor, Text Forge, Word Counter, Pomodoro.
- **UTILITY**: Unit Converter, QR Generator, Color Suite, Hash Engine.

### 💎 THE VALUES

- **OUR PROMISE**: A transparency-first Manifesto on privacy, speed, and open source.
- **ROSTER**: A real-time display of the suite's status and the team behind the logic.
- **INQUIRY**: A community-driven board where users suggest features and report bugs.

---

## 🎨 DESIGN PHILOSOPHY: KINETIC BRUTALISM

Clef is defined by its "Kinetic Brutalist" aesthetic — a blend of raw, heavy-border UI and fluid GSAP-powered motion.

- **Kinetic Portal**: A high-impact startup animation that initializes the home experience.
- **Vibrant Identity**: A multi-color theme system (Cyan, Yellow, Green, Purple, Red) that synchronizes across components.
- **Typography First**: Heavy use of **Oswald** for impact and **Inter** for readability.
- **Watermark System**: Integrated background typographic watermarks that define each section.

---

## 🤖 CLEF AI: THE LOGIC ENGINE

Clef features an integrated AI assistant powered by **Llama 3.1**. It is built for raw logic, code debugging, and high-density text synthesis.

### 🌟 FEATURES

- **Inside-Out Overhaul**: A hardened chat foundation with full support for Markdown, LaTeX, and rehype-raw formatting.
- **Session Aware**: Redesigned Welcome Popups that recognize new vs. returning users.
- **Secure Sync**: Cross-device history sync via [Convex](https://www.convex.dev/) for signed-in users.
- **Ephemeral Logic**: Guest data stays on-device; Cloud data is AES-256 encrypted.

---

## 🏗️ TECH STACK

- **FRONTEND**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [GSAP](https://gsap.com/)
- **BACKEND**: [Convex](https://www.convex.dev/) (Serverless Real-time Database)
- **MOTION**: [GSAP](https://gsap.com/) + [Lenis](https://lenis.darkroom.engineering/) (Smooth Scroll)
- **AUTH**: [Convex Auth](https://labs.convex.dev/auth)
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
