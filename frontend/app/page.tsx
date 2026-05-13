"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("Scam analysis result will appear here");

  const analyzeMessage = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/detect-scam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      });

      const data = await response.json();

      setResult(
        `Risk Score: ${data.risk_score}% | ${
          data.is_scam ? "⚠️ Potential Scam" : "✅ Safe"
        }`
      );
    } catch (error) {
      setResult("Backend connection failed");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-cyan-400 mb-4">
          AI ScamShield
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Detect scams instantly using AI-powered message analysis
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4">Scan Message</h2>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste suspicious message here..."
              className="w-full h-48 bg-slate-800 rounded-xl p-4"
            />

            <button
              onClick={analyzeMessage}
              className="mt-4 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-semibold"
            >
              Analyze
            </button>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4">Detection Result</h2>

            <div className="bg-slate-800 p-6 rounded-xl">
              {result}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}