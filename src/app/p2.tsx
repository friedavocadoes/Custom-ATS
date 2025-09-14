"use client";

import { useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    const res = await fetch("/api/analyze", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(false);

    setResult(data.error ? `Error: ${data.error}` : data.output);
  }

  return (
    <main style={{ padding: 20 }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => {
            setRole(e.target.value);
          }}
          value={role}
          className="border-2 mx-4"
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={!file || loading}
          className="ml-10 border-2 p-2"
        >
          {loading ? "Analyzing…" : "Upload & Analyze"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <MarkdownPreview className="markdown-preview" source={result} />
        </div>
      )}
    </main>
  );
}
