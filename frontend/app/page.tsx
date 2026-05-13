"use client";

import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState("message");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    const endpoint =
      mode === "message"
        ? "http://127.0.0.1:8000/detect-scam"
        : "http://127.0.0.1:8000/detect-url";

    const body =
      mode === "message"
        ? { text: input }
        : { url: input };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        risk_score: 0,
        reasons: ["Backend connection failed"],
      });
    }
  };

  const isDanger =
    result?.is_scam || result?.is_phishing;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-cyan-400 mb-4">
          AI ScamShield
        </h1>

        <p className="text-slate-300 text-lg mb-8">
          Detect scams and phishing attempts instantly
        </p>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setMode("message");
              setResult(null);
            }}
            className={`px-5 py-3 rounded-xl ${
              mode === "message"
                ? "bg-cyan-500"
                : "bg-slate-800"
            }`}
          >
            Message Scanner
          </button>

          <button
            onClick={() => {
              setMode("url");
              setResult(null);
            }}
            className={`px-5 py-3 rounded-xl ${
              mode === "url"
                ? "bg-cyan-500"
                : "bg-slate-800"
            }`}
          >
            URL Scanner
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4">
              {mode === "message"
                ? "Scan Message"
                : "Scan URL"}
            </h2>

            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder={
                mode === "message"
                  ? "Paste suspicious message..."
                  : "Paste suspicious URL..."
              }
              className="w-full h-48 bg-slate-800 rounded-xl p-4"
            />

            <button
              onClick={analyze}
              className="mt-4 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
            >
              Analyze
            </button>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4">
              Detection Result
            </h2>

            <div className="bg-slate-800 p-6 rounded-xl">
              {result ? (
                <>
                  <p className="text-xl font-bold mb-4">
                    Risk Score: {result.risk_score}%{" "}
                    {isDanger
                      ? "⚠️ Threat Detected"
                      : "✅ Safe"}
                  </p>

                  <h3 className="text-cyan-400 mb-2">
                    Reasons
                  </h3>

                  <ul className="list-disc ml-6">
                    {result.reasons.map(
                      (
                        reason: string,
                        index: number
                      ) => (
                        <li key={index}>
                          {reason}
                        </li>
                      )
                    )}
                  </ul>
                </>
              ) : (
                <p className="text-slate-400">
                  Analysis result appears here
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}