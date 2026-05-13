"use client";

import { useState } from "react";

import {
  Shield,
  Link,
  MessageSquareWarning,
  BrainCircuit,
  ImageIcon,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const quizQuestions = [
  {
    text: "URGENT! Your bank account is blocked. Verify OTP now.",
    answer: true,
  },
  {
    text: "Your Amazon package will arrive tomorrow.",
    answer: false,
  },
  {
    text: "Congratulations! You won free money. Click now.",
    answer: true,
  },
];

export default function Home() {

  const [mode, setMode] = useState("message");

  const [input, setInput] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [quizIndex, setQuizIndex] = useState(0);

  const [quizScore, setQuizScore] = useState(0);

  const [quizResult, setQuizResult] = useState("");

  const analyze = async () => {

    setLoading(true);

    try {

      if (mode === "image") {

        if (!image) return;

        const formData = new FormData();

        formData.append("file", image);

        const response = await fetch(
          "https://ai-scamshield-backend.onrender.com",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        setResult(data);

        setLoading(false);

        return;
      }

      const endpoint =
        mode === "message"
          ? "http://127.0.0.1:8000/detect-scam"
          : "http://127.0.0.1:8000/detect-url";

      const body =
        mode === "message"
          ? { text: input }
          : { url: input };

      const response = await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      setResult(data);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  };

  const answerQuiz = (
    guess: boolean
  ) => {

    const correct =
      quizQuestions[quizIndex].answer;

    if (guess === correct) {

      setQuizScore(
        quizScore + 1
      );

      setQuizResult(
        "✅ Correct"
      );

    } else {

      setQuizResult(
        "❌ Incorrect"
      );
    }

    setTimeout(() => {

      setQuizResult("");

      setQuizIndex(
        (quizIndex + 1) %
          quizQuestions.length
      );

    }, 1500);
  };

  const isDanger =
    result?.is_scam ||
    result?.is_phishing;

  return (

    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f172a,black)]"></div>

      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Hero */}
        <div className="text-center mb-14">

          <div className="flex justify-center mb-6">

            <div className="bg-cyan-500/20 border border-cyan-400 p-5 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.5)]">

              <Shield className="w-14 h-14 text-cyan-400" />

            </div>

          </div>

          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">

            AI ScamShield

          </h1>

          <p className="text-slate-400 text-xl max-w-3xl mx-auto">

            Advanced AI-powered scam,
            phishing, and cyber fraud
            detection platform with
            real-time intelligence.

          </p>

        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-5 mb-12">

          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">

            <MessageSquareWarning className="text-cyan-400 mb-4 w-10 h-10" />

            <h2 className="text-xl font-bold mb-2">
              Message Scanner
            </h2>

            <p className="text-slate-400 text-sm">

              Detect scam messages,
              fake OTPs, and fraud
              attempts instantly.

            </p>

          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">

            <Link className="text-purple-400 mb-4 w-10 h-10" />

            <h2 className="text-xl font-bold mb-2">
              URL Scanner
            </h2>

            <p className="text-slate-400 text-sm">

              AI-powered phishing URL
              analysis with live risk
              scoring.

            </p>

          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">

            <ImageIcon className="text-pink-400 mb-4 w-10 h-10" />

            <h2 className="text-xl font-bold mb-2">
              OCR Detection
            </h2>

            <p className="text-slate-400 text-sm">

              Upload screenshots to
              extract scam text using
              OCR intelligence.

            </p>

          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">

            <BrainCircuit className="text-green-400 mb-4 w-10 h-10" />

            <h2 className="text-xl font-bold mb-2">
              Scam Quiz
            </h2>

            <p className="text-slate-400 text-sm">

              Interactive cybersecurity
              awareness training mode.

            </p>

          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">

          <button
            onClick={() => {
              setMode("message");
              setResult(null);
            }}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              mode === "message"
                ? "bg-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            Message
          </button>

          <button
            onClick={() => {
              setMode("url");
              setResult(null);
            }}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              mode === "url"
                ? "bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            URL
          </button>

          <button
            onClick={() => {
              setMode("image");
              setResult(null);
            }}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              mode === "image"
                ? "bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.5)]"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            Screenshot
          </button>

          <button
            onClick={() => {
              setMode("quiz");
              setResult(null);
            }}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              mode === "quiz"
                ? "bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                : "bg-slate-900 border border-slate-700"
            }`}
          >
            Quiz Mode
          </button>

        </div>

        {mode === "quiz" ? (

          <div className="max-w-3xl mx-auto bg-slate-900/70 border border-slate-800 rounded-3xl p-10 backdrop-blur-xl">

            <h2 className="text-4xl font-bold mb-6">

              Scam Awareness Quiz

            </h2>

            <div className="bg-slate-800 rounded-2xl p-8 mb-8">

              <p className="text-2xl">

                {
                  quizQuestions[
                    quizIndex
                  ].text
                }

              </p>

            </div>

            <div className="flex gap-4">

              <button
                onClick={() =>
                  answerQuiz(true)
                }
                className="flex-1 bg-red-500 hover:bg-red-600 transition-all py-4 rounded-2xl text-lg font-bold"
              >
                Scam
              </button>

              <button
                onClick={() =>
                  answerQuiz(false)
                }
                className="flex-1 bg-green-500 hover:bg-green-600 transition-all py-4 rounded-2xl text-lg font-bold"
              >
                Safe
              </button>

            </div>

            <div className="mt-8 flex justify-between items-center">

              <p className="text-2xl">
                {quizResult}
              </p>

              <p className="text-cyan-400 text-2xl font-bold">
                Score: {quizScore}
              </p>

            </div>

          </div>

        ) : (

          <div className="grid lg:grid-cols-2 gap-8">

            {/* Input */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">

              <h2 className="text-3xl font-bold mb-6">
                Threat Scanner
              </h2>

              {mode === "image" ? (

                <div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {

                      if (
                        e.target
                          .files?.[0]
                      ) {

                        const file =
                          e.target
                            .files[0];

                        setImage(file);

                        setImagePreview(
                          URL.createObjectURL(
                            file
                          )
                        );
                      }
                    }}
                    className="w-full bg-slate-800 rounded-2xl p-4"
                  />

                  {imagePreview && (

                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-6 rounded-2xl border border-slate-700"
                    />

                  )}

                </div>

              ) : (

                <textarea
                  value={input}
                  onChange={(e) =>
                    setInput(
                      e.target.value
                    )
                  }
                  placeholder={
                    mode ===
                    "message"
                      ? "Paste suspicious message..."
                      : "Paste suspicious URL..."
                  }
                  className="w-full h-56 bg-slate-800 border border-slate-700 rounded-2xl p-5 text-lg outline-none focus:border-cyan-400"
                />

              )}

              <button
                onClick={analyze}
                className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-[1.02] transition-all py-4 rounded-2xl text-xl font-bold shadow-[0_0_30px_rgba(34,211,238,0.3)]"
              >

                {loading
                  ? "Analyzing..."
                  : "Analyze Threat"}

              </button>

            </div>

            {/* Results */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">

              <h2 className="text-3xl font-bold mb-6">
                Detection Result
              </h2>

              {result ? (

                <div>

                  <div
                    className={`rounded-3xl p-6 mb-6 border ${
                      isDanger
                        ? "bg-red-500/10 border-red-500"
                        : "bg-green-500/10 border-green-500"
                    }`}
                  >

                    <div className="flex items-center gap-4 mb-4">

                      {isDanger ? (

                        <AlertTriangle className="text-red-400 w-10 h-10" />

                      ) : (

                        <CheckCircle2 className="text-green-400 w-10 h-10" />

                      )}

                      <div>

                        <h3 className="text-2xl font-bold">

                          {isDanger
                            ? "Threat Detected"
                            : "Looks Safe"}

                        </h3>

                        <p className="text-slate-300">

                          Risk Score:
                          {" "}
                          {
                            result.risk_score
                          }
                          %

                        </p>

                      </div>

                    </div>

                  </div>

                  {result.extracted_text && (

                    <div className="mb-6">

                      <h3 className="text-cyan-400 text-xl mb-3">

                        Extracted Text

                      </h3>

                      <div className="bg-slate-800 rounded-2xl p-5 text-slate-300">

                        {
                          result.extracted_text
                        }

                      </div>

                    </div>

                  )}

                  {result.ai_explanation && (

                    <div className="mb-6">

                      <h3 className="text-purple-400 text-xl mb-3">

                        AI Explanation

                      </h3>

                      <div className="bg-purple-500/10 border border-purple-500 rounded-2xl p-5 text-slate-300 leading-relaxed">

                        {
                          result.ai_explanation
                        }

                      </div>

                    </div>

                  )}

                  <div>

                    <h3 className="text-cyan-400 text-xl mb-3">

                      Detection Reasons

                    </h3>

                    <ul className="space-y-3">

                      {result.reasons.map(
                        (
                          reason: string,
                          index: number
                        ) => (

                          <li
                            key={index}
                            className="bg-slate-800 rounded-xl p-4 border border-slate-700"
                          >

                            {reason}

                          </li>

                        )
                      )}

                    </ul>

                  </div>

                </div>

              ) : (

                <div className="h-full flex items-center justify-center text-slate-500 text-lg">

                  No analysis yet.

                </div>

              )}

            </div>

          </div>

        )}

      </div>

    </main>
  );
}