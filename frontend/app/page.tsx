"use client";

import { useState } from "react";

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

  const [quizIndex, setQuizIndex] = useState(0);

  const [quizScore, setQuizScore] = useState(0);

  const [quizResult, setQuizResult] = useState("");

  const analyze = async () => {

    if (mode === "image") {

      if (!image) return;

      const formData = new FormData();

      formData.append("file", image);

      const response = await fetch(
        "http://127.0.0.1:8000/scan-image",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setResult(data);

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

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    setResult(data);
  };

  const answerQuiz = (guess: boolean) => {

    const correct = quizQuestions[quizIndex].answer;

    if (guess === correct) {

      setQuizScore(quizScore + 1);

      setQuizResult("✅ Correct");

    } else {

      setQuizResult("❌ Incorrect");
    }

    setTimeout(() => {

      setQuizResult("");

      setQuizIndex(
        (quizIndex + 1) % quizQuestions.length
      );

    }, 1500);
  };

  const isDanger =
    result?.is_scam || result?.is_phishing;

  return (

    <main className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold text-cyan-400 mb-4">
          AI ScamShield
        </h1>

        <p className="text-slate-400 text-lg mb-8">
          AI-powered scam and phishing detection platform
        </p>

        <div className="flex flex-wrap gap-4 mb-8">

          <button
            onClick={() => {
              setMode("message");
              setResult(null);
            }}
            className="px-4 py-2 bg-slate-800 rounded-xl"
          >
            Message
          </button>

          <button
            onClick={() => {
              setMode("url");
              setResult(null);
            }}
            className="px-4 py-2 bg-slate-800 rounded-xl"
          >
            URL
          </button>

          <button
            onClick={() => {
              setMode("image");
              setResult(null);
            }}
            className="px-4 py-2 bg-slate-800 rounded-xl"
          >
            Screenshot
          </button>

          <button
            onClick={() => {
              setMode("quiz");
              setResult(null);
            }}
            className="px-4 py-2 bg-cyan-500 rounded-xl"
          >
            Quiz Mode
          </button>

        </div>

        {mode === "quiz" ? (

          <div className="bg-slate-900 p-8 rounded-2xl">

            <h2 className="text-3xl mb-6">
              Scam Awareness Quiz
            </h2>

            <p className="text-xl mb-8">
              {quizQuestions[quizIndex].text}
            </p>

            <div className="flex gap-4">

              <button
                onClick={() => answerQuiz(true)}
                className="bg-red-500 px-6 py-3 rounded-xl"
              >
                Scam
              </button>

              <button
                onClick={() => answerQuiz(false)}
                className="bg-green-500 px-6 py-3 rounded-xl"
              >
                Safe
              </button>

            </div>

            <p className="mt-6 text-xl">
              {quizResult}
            </p>

            <p className="mt-4 text-cyan-400 text-lg">
              Score: {quizScore}
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-slate-900 p-6 rounded-2xl">

              {mode === "image" ? (

                <>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {

                      if (e.target.files?.[0]) {

                        const file =
                          e.target.files[0];

                        setImage(file);

                        setImagePreview(
                          URL.createObjectURL(file)
                        );
                      }
                    }}
                    className="w-full"
                  />

                  {imagePreview && (

                    <img
                      src={imagePreview}
                      alt="Uploaded screenshot"
                      className="mt-6 rounded-xl border border-slate-700 max-h-[400px] object-contain"
                    />

                  )}

                </>

              ) : (

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

              )}

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

              {result ? (

                <>

                  {result.extracted_text && (

                    <div className="mb-6">

                      <h3 className="text-cyan-400 mb-2">
                        Extracted Text
                      </h3>

                      <div className="bg-slate-800 p-4 rounded-xl text-slate-300">
                        {result.extracted_text}
                      </div>

                    </div>

                  )}

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

        )}

      </div>

    </main>
  );
}