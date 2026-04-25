import { useState, useEffect, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

export default function PomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const { showToast } = useToast();

  const totalSeconds = isBreak ? breakMinutes * 60 : workMinutes * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  const tick = useCallback(() => {
    setSeconds(prev => {
      if (prev <= 1) {
        setIsRunning(false);
        if (!isBreak) {
          setSessions(s => s + 1);
          setIsBreak(true);
          showToast("Work session complete! Time for a break.", "success");
          return breakMinutes * 60;
        } else {
          setIsBreak(false);
          showToast("Break over! Ready for the next session.", "info");
          return workMinutes * 60;
        }
      }
      return prev - 1;
    });
  }, [isBreak, breakMinutes, workMinutes, showToast]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(tick, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, tick]);

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setSeconds(workMinutes * 60);
  };

  const skip = () => {
    setIsRunning(false);
    if (!isBreak) {
      setIsBreak(true);
      setSeconds(breakMinutes * 60);
    } else {
      setIsBreak(false);
      setSeconds(workMinutes * 60);
    }
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <ToolLayout toolId="pomodoro-timer">
      <div className="max-w-md mx-auto text-center">
        {/* Mode Indicator */}
        <div className={`border-[3px] border-black px-4 py-2 mb-6 inline-block ${isBreak ? "bg-[#059669] text-white" : "bg-[#FF0004] text-white"}`}>
          <span className="font-oswald text-xs font-bold uppercase tracking-widest">
            {isBreak ? "BREAK TIME" : "WORK SESSION"}
          </span>
        </div>

        {/* Timer Display */}
        <div className="border-[3px] border-black mb-6">
          <div className="py-12 px-6">
            <div className="font-oswald text-7xl md:text-9xl font-bold tracking-tight">
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-3 bg-[#fafafa] border-t-[3px] border-black">
            <div className="h-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: isBreak ? "#059669" : "#FF0004" }} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-8">
          <button onClick={() => setIsRunning(!isRunning)} className={`btn-brutal flex items-center gap-2 ${isRunning ? "btn-brutal-red" : "btn-brutal-yellow"}`}>
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            {isRunning ? "PAUSE" : "START"}
          </button>
          <button onClick={skip} className="btn-brutal bg-white flex items-center gap-2">
            <SkipForward size={18} />
            SKIP
          </button>
          <button onClick={reset} className="btn-brutal btn-brutal-black flex items-center gap-2">
            <RotateCcw size={18} />
            RESET
          </button>
        </div>

        {/* Settings */}
        <div className="border-[3px] border-black mb-4">
          <div className="grid grid-cols-2 gap-0">
            <div className="p-4 border-r-[3px] border-black">
              <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">Work (min)</label>
              <input type="number" min={1} max={60} value={workMinutes} onChange={(e) => { setWorkMinutes(+e.target.value); if (!isRunning && !isBreak) setSeconds(+e.target.value * 60); }} className="input-brutal text-center font-mono" />
            </div>
            <div className="p-4">
              <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">Break (min)</label>
              <input type="number" min={1} max={30} value={breakMinutes} onChange={(e) => { setBreakMinutes(+e.target.value); if (!isRunning && isBreak) setSeconds(+e.target.value * 60); }} className="input-brutal text-center font-mono" />
            </div>
          </div>
        </div>

        {/* Sessions Counter */}
        <div className="border-[3px] border-black px-4 py-3 bg-[#F9FF00]">
          <span className="font-oswald text-sm font-bold uppercase tracking-wider">
            Sessions Completed: {sessions}
          </span>
        </div>
      </div>
    </ToolLayout>
  );
}
