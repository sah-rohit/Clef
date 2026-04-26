import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device supports hover (mouse/trackpad) and is large screen
    const supportsHover = window.matchMedia("(hover: hover)").matches;
    const isLargeScreen = window.innerWidth >= 1024;
    
    if (!supportsHover || !isLargeScreen) {
      setIsVisible(false);
      return;
    }

    const updatePosition = (e: MouseEvent) => {
      // Show cursor as soon as mouse moves
      if (!isVisible) setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.tagName === "INPUT" || 
        target.tagName === "TEXTAREA" ||
        target.closest("button") ||
        target.closest("a") ||
        window.getComputedStyle(target).cursor === "pointer";
      
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", updatePosition, { passive: true });
    window.addEventListener("mouseover", updateHoverState, { passive: true });
    
    // Hide when mouse leaves the window
    document.addEventListener("mouseleave", () => setIsVisible(false));
    document.addEventListener("mouseenter", () => setIsVisible(true));

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", updateHoverState);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`pointer-events-none fixed inset-0 z-[9999] ${isHovering ? "cursor-hover" : ""}`}>
      <div 
        id="custom-cursor" 
        style={{ left: `${position.x}px`, top: `${position.y}px` }} 
      />
      <div 
        id="custom-cursor-outline" 
        style={{ left: `${position.x}px`, top: `${position.y}px` }} 
      />
    </div>
  );
}
