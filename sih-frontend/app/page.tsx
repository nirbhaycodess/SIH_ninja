"use client";
import React, { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // REPLACE THIS with your actual Oracle VM Public IP and port 8000
  //const BACKEND_URL = "http://80.225.241.2:8000/api/audit-label";
 const BACKEND_URL= "https://bidder-medications-civic-sunny.trycloudflare.com";
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Failed to connect to Oracle backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-400">
            SIH 2026: Legal Metrology Compliance Auditor
          </h1>
          <p className="text-gray-400">
            AI-powered product label inspection using Hermes 3B & RAG
          </p>
        </header>

        {/* Upload Box */}
        <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl p-8 text-center space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            Select Product Label Image
          </label>
          {file && <p className="text-sm text-gray-300">Selected: {file.name}</p>}

          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                src={preview}
                alt="Label Preview"
                className="max-h-64 rounded-lg border border-gray-700 object-contain"
              />
            </div>
          )}

          {file && (
            <div>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition w-full md:w-auto"
              >
                {loading ? "Auditing Label with AI..." : "Run Compliance Audit"}
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-700 pb-4">
              <div>
                <h2 className="text-xl font-semibold">Audit Report</h2>
                <p className="text-xs text-gray-400">Database ID: {result.audit_id || "Saved"}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                    result.status === "PASS"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {result.status}
                </span>
                <span className="text-sm bg-gray-700 px-3 py-1.5 rounded-full text-gray-300">
                  Confidence: {result.confidence}%
                </span>
              </div>
            </div>

            {/* Reasons if failing */}
            {result.reasons && result.reasons.length > 0 && (
              <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                  Compliance Violations / Reasons
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  {result.reasons.map((reason: string, idx: number) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rule-by-rule Color Grading */}
            {result.rules_summary && result.rules_summary.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Rule Breakdown
                </h3>
                <div className="grid gap-3">
                  {result.rules_summary.map((rule: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gray-900 border border-gray-700 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-white">{rule.rule}</p>
                        <p className="text-xs text-gray-400">{rule.detail}</p>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold uppercase ${
                          rule.color === "green"
                            ? "bg-green-500/20 text-green-400"
                            : rule.color === "red"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {rule.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted OCR Text Dropdown */}
            <details className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-sm text-gray-400">
              <summary className="cursor-pointer font-medium text-gray-300">
                View Raw OCR Extracted Text
              </summary>
              <p className="mt-2 whitespace-pre-wrap font-mono text-xs text-gray-400">
                {result.extracted_text}
              </p>
            </details>
          </div>
        )}
      </div>
    </main>
  );
}