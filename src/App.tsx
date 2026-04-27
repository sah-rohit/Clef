import { Routes, Route, useLocation } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookiePolicy from "./pages/CookiePolicy";
import UserAgreement from "./pages/UserAgreement";
import Login from "./pages/Login";
import AccountCenter from "./pages/AccountCenter";
import OpenSource from "./pages/OpenSource";
import Github from "./pages/Github";
import Contact from "./pages/Contact";
import HowToUse from "./pages/HowToUse";
import Changelog from "./pages/Changelog";
import ToolsGuide from "./pages/ToolsGuide";

import Features from "./pages/Features";

// Tool Pages
import TextFileMaker from "./pages/tools/TextFileMaker";
import CodeEditor from "./pages/tools/CodeEditor";
import MarkdownEditor from "./pages/tools/MarkdownEditor";
import ColorConverter from "./pages/tools/ColorConverter";
import JsonFormatter from "./pages/tools/JsonFormatter";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import QrCodeGenerator from "./pages/tools/QrCodeGenerator";
import Base64Tools from "./pages/tools/Base64Tools";
import LoremIpsum from "./pages/tools/LoremIpsum";
import WordCounter from "./pages/tools/WordCounter";
import UnitConverter from "./pages/tools/UnitConverter";
import PomodoroTimer from "./pages/tools/PomodoroTimer";
import CalculatorTool from "./pages/tools/CalculatorTool";
import UrlEncoder from "./pages/tools/UrlEncoder";
import UuidGenerator from "./pages/tools/UuidGenerator";
import RegexTester from "./pages/tools/RegexTester";
import ImageToBase64 from "./pages/tools/ImageToBase64";
import HashGenerator from "./pages/tools/HashGenerator";
import CssMinifier from "./pages/tools/CssMinifier";
import DiffChecker from "./pages/tools/DiffChecker";
import TimestampConverter from "./pages/tools/TimestampConverter";
import ColorPalette from "./pages/tools/ColorPalette";
import TextCaseConverter from "./pages/tools/TextCaseConverter";
import NumberBaseConverter from "./pages/tools/NumberBaseConverter";
import AspectRatio from "./pages/tools/AspectRatio";
import JwtDecoder from "./pages/tools/JwtDecoder";
import CronBuilder from "./pages/tools/CronBuilder";

import { ScrollToTop } from "./components/ScrollToTop";
import { CustomCursor } from "./components/CustomCursor";
import { ClefAI } from "./components/ClefAI";
import { WelcomePopup } from "./components/WelcomePopup";
import PWAReloadPrompt from "./components/PWAReloadPrompt";
import { PageLoader } from "./components/PageLoader";
import { PageTransition } from "./components/PageTransition";
import { FooterBar } from "./components/FooterBar";
import { NetworkStatus } from "./components/NetworkStatus";
import { StartupAnimation } from "./components/StartupAnimation";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function App() {
  const location = useLocation();

  // Global ScrollTrigger refresh on route change
  useEffect(() => {
    // Small delay to ensure the DOM has rendered and transitions have started/settled
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      // If Lenis is present, notify it too
      if ((window as any).__lenis__) {
        (window as any).__lenis__.resize();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname, location.key]);

  return (
    <div className="min-h-screen bg-white">
      <StartupAnimation />
      <PageLoader />
      <CustomCursor />
      <ScrollToTop />
      <PageTransition>
        <Routes>
      <Route index element={<Home />} />
      <Route path="features" element={<Features />} />
      <Route path="about" element={<About />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="privacy" element={<PrivacyPolicy />} />
      <Route path="terms" element={<TermsAndConditions />} />
      <Route path="cookies" element={<CookiePolicy />} />
      <Route path="agreement" element={<UserAgreement />} />
      <Route path="login" element={<Login />} />
      <Route path="/account" element={<AccountCenter />} />
      <Route path="/open-source" element={<OpenSource />} />
      <Route path="github" element={<Github />} />
      <Route path="contact" element={<Contact />} />
      <Route path="how-to-use" element={<HowToUse />} />
      <Route path="changelog" element={<Changelog />} />
      <Route path="tools-guide" element={<ToolsGuide />} />
      
      {/* Tools Routes */}
      <Route path="tools">
        <Route path="text-file-maker" element={<TextFileMaker />} />
        <Route path="code-editor" element={<CodeEditor />} />
        <Route path="markdown-editor" element={<MarkdownEditor />} />
        <Route path="color-converter" element={<ColorConverter />} />
        <Route path="json-formatter" element={<JsonFormatter />} />
        <Route path="password-generator" element={<PasswordGenerator />} />
        <Route path="qr-code-generator" element={<QrCodeGenerator />} />
        <Route path="base64-tools" element={<Base64Tools />} />
        <Route path="lorem-ipsum" element={<LoremIpsum />} />
        <Route path="word-counter" element={<WordCounter />} />
        <Route path="unit-converter" element={<UnitConverter />} />
        <Route path="pomodoro-timer" element={<PomodoroTimer />} />
        <Route path="calculator" element={<CalculatorTool />} />
        <Route path="url-encoder" element={<UrlEncoder />} />
        <Route path="uuid-generator" element={<UuidGenerator />} />
        <Route path="regex-tester" element={<RegexTester />} />
        <Route path="image-to-base64" element={<ImageToBase64 />} />
        <Route path="hash-generator" element={<HashGenerator />} />
        <Route path="css-minifier" element={<CssMinifier />} />
        <Route path="diff-checker" element={<DiffChecker />} />
        <Route path="timestamp-converter" element={<TimestampConverter />} />
        <Route path="color-palette" element={<ColorPalette />} />
        <Route path="text-case-converter" element={<TextCaseConverter />} />
        <Route path="number-base-converter" element={<NumberBaseConverter />} />
        <Route path="aspect-ratio" element={<AspectRatio />} />
        <Route path="jwt-decoder" element={<JwtDecoder />} />
        <Route path="cron-builder" element={<CronBuilder />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
    </PageTransition>
    <WelcomePopup />
    <ClefAI />
    <FooterBar />
    <NetworkStatus />
    <PWAReloadPrompt />
    </div>
  );
}
