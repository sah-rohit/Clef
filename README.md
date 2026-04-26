# 🎹 CLEF PRODUCTIVITY SUITE

![Clef Banner](https://raw.githubusercontent.com/sah-rohit/clef/main/public/banner.png)

> **[LIVE DEMO: MY_LINK_HERE]**
>
> **HIGH-FIDELITY BRUTALIST UTILITY HUB. BUILT FOR CREATORS. POWERED BY CLOUD.**

---

## 🛠 THE ARCHITECTURE

Clef is a high-performance, privacy-focused productivity suite designed with a **Brutalist Aesthetic**. It consolidates essential developer and creator utilities into a single, lightning-fast interface.

### ⚡ CORE FEATURES

- **UTILITY FORGE**: Text generators, UUID creators, JSON formatters, and markdown editors.
- **COMMUNITY BOARD**: Real-time feedback and experiences shared globally.
- **ACCOUNT CENTER**: Secure cloud-synced profiles, session management, and data export.
- **GUEST MODE**: Full tool access without ever creating an account (Local Storage).

---

## 🏗 TECH STACK

- **FRONTEND**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **BACKEND**: [Convex](https://www.convex.dev/) (Serverless Real-time Database)
- **AUTH**: [Convex Auth](https://labs.convex.dev/auth) (Secure Email/Password & Session Management)
- **STYLING**: Vanilla CSS (Custom Brutalist Design System)
- **ICONS**: [Lucide React](https://lucide.dev/)

---

## 🚀 LOCAL SETUP (FOR DEVELOPERS)

### 1. CLONE THE FORGE

```bash
git clone https://github.com/your-username/clef.git
cd clef
```

### 2. INSTALL DEPENDENCIES

```bash
npm install
```

### 3. CONFIGURE ENVIRONMENT

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and paste your **Convex Deployment URL**.
3. To enable AI features locally, run:
   ```bash
   npx convex env set GROQ_API_KEY your_key_here
   ```

### 4. RUN DEV ENVIRONMENT

```bash
npx convex dev
# In a new terminal
npm run dev
```

---

## 🛡 SECURITY & PRIVACY

- **ZERO TRACKING**: No third-party trackers or analytics.
- **YOUR DATA, YOUR CHOICE**: Export your entire user profile and history as JSON at any time.
- **SECURE SESSIONS**: All sensitive logic (like AI API calls) is handled on the **Convex Backend** to ensure API keys never leak to the client.

---

## 🤖 DEVELOPMENT NOTE

This project was developed with the assistance of advanced AI modeling to ensure logical consistency and rapid iteration, while maintaining a strictly human-led design philosophy and aesthetic vision.

---

## ⚖️ LICENSE

This project is open-source and available under the **MIT License**. See the `/open-source` page on the website for more details.

**Built with 🖤 by Rohit Sah**
