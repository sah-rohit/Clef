import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  // Use refs for position to avoid re-renders on every mousemove
  const pos = useRef({ x: -200, y: -200 });
  // Track visibility in a ref so event handlers never go stale
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const supportsHover = window.matchMedia("(hover: hover)").matches;
    const isLargeScreen = window.innerWidth >= 1024;
    if (!supportsHover || !isLargeScreen) return;

    // Move elements directly via style — no React state, no lag
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t) return;
      const interactive =
        t.tagName === "A" ||
        t.tagName === "BUTTON" ||
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        !!t.closest("a") ||
        !!t.closest("button") ||
        window.getComputedStyle(t).cursor === "pointer";
      setIsHovering(!!interactive);
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);
    const onLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };
    const onEnter = () => {
      // Don't force visible on enter — wait for first mousemove
      // so position is known before showing
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* 
        DOT — small filled square, always centered on cursor.
        Uses mix-blend-mode: difference so it inverts whatever is behind it,
        making it visible on ANY background color.
      */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isClicking ? 6 : 8,
          height: isClicking ? 6 : 8,
          marginLeft: isClicking ? -3 : -4,
          marginTop: isClicking ? -3 : -4,
          background: "#ffffff",
          mixBlendMode: "difference",
          zIndex: 99999,
          pointerEvents: "none",
          transition: "width 0.1s, height 0.1s, margin 0.1s",
          transform: `translate(${pos.current.x}px, ${pos.current.y}px)`,
        }}
      />

      {/*
        RING — larger square outline that follows with a slight lag.
        On hover: fills with brand yellow, shrinks slightly.
        On click: shrinks further.
        Also uses mix-blend-mode: difference for universal visibility.
      */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isClicking ? 24 : isHovering ? 32 : 40,
          height: isClicking ? 24 : isHovering ? 32 : 40,
          marginLeft: isClicking ? -12 : isHovering ? -16 : -20,
          marginTop: isClicking ? -12 : isHovering ? -16 : -20,
          background: isHovering ? "#F9FF00" : "transparent",
          border: "2px solid #ffffff",
          mixBlendMode: "difference",
          zIndex: 99998,
          pointerEvents: "none",
          transition: "width 0.15s cubic-bezier(0.16,1,0.3,1), height 0.15s cubic-bezier(0.16,1,0.3,1), margin 0.15s cubic-bezier(0.16,1,0.3,1), background 0.15s",
          transform: `translate(${pos.current.x}px, ${pos.current.y}px)`,
        }}
      />
    </>
  );
}
