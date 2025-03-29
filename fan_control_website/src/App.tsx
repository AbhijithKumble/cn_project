import React, { useState, useEffect } from "react";
import { Fan, Power, Timer } from "lucide-react";

const ESP32_SERVER = "http://10.203.229.2";

function App() {
  const [speed, setSpeed] = useState(0);
  const [timer, setTimer] = useState(0);

  const speeds = [
    { level: 0, name: "Off", rotation: "animate-none", color: "bg-gray-200" },
    { level: 1, name: "Breeze", rotation: "animate-[spin_2.5s_linear_infinite]", color: "bg-blue-400" },
    { level: 2, name: "Wind", rotation: "animate-[spin_1.5s_linear_infinite]", color: "bg-indigo-500" },
    { level: 3, name: "Storm", rotation: "animate-[spin_0.75s_linear_infinite]", color: "bg-purple-500" },
  ];
const speedLevels = ['stop', 'low', 'mid', 'high'];

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            updateSpeed(0); // Turn off fan when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const updateSpeed = async (newSpeed: number) => {
    setSpeed(newSpeed);
    try {
      await fetch(`${ESP32_SERVER}/${speedLevels[newSpeed]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speed: newSpeed }),
      });
    } catch (error) {
      console.error("Failed to update speed:", error);
    }
  };

  const updateTimer = async (newTimer: number) => {
    setTimer(newTimer);
    try {
      await fetch(`${ESP32_SERVER}/setTimer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timer: newTimer }),
      });
    } catch (error) {
      console.error("Failed to update timer:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20">
        {timer > 0 && (
          <div className="absolute top-4 left-4 flex items-center gap-2 text-white/80">
            <Timer size={20} />
            <span className="font-medium">{formatTime(timer)}</span>
          </div>
        )}

        <div className="relative flex flex-col items-center mb-8">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center mb-6 relative">
            <div className={`absolute inset-2 rounded-full ${speeds[speed].color} opacity-20 blur-md transition-all duration-500`} />
            <div className={`relative text-white transition-all duration-300 ${speeds[speed].rotation}`}>
              <Fan size={80} strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{speeds[speed].name}</h1>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${speed > 0 ? "bg-green-500" : "bg-gray-600"} text-white transition-colors`}>
              {speed > 0 ? "Active" : "Standby"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {speeds.map((s) => (
            <button
              key={s.level}
              onClick={() => updateSpeed(s.level)}
              className={`aspect-square rounded-2xl font-medium transition-all duration-200 flex items-center justify-center
                ${
                  speed === s.level
                    ? `${s.color} text-white shadow-lg shadow-${s.color}/50`
                    : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
            >
              {s.level}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => updateTimer(timer === 0 ? 1800 : timer === 1800 ? 3600 : 0)}
            className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-200
              ${timer > 0 ? "bg-purple-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"}`}
          >
            <Timer size={24} />
            <span className="text-sm">Timer</span>
          </button>

          <button
            onClick={() => {
              updateSpeed(0);
              updateTimer(0);
            }}
            className="p-4 rounded-xl flex flex-col items-center gap-2 bg-white/5 text-white/80 hover:bg-red-500 hover:text-white transition-all duration-200"
          >
            <Power size={24} />
            <span className="text-sm">Power</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

