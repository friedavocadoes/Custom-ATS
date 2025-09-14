"use client";

import { useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { ResumeForm } from "@/components/ResumeForm";
import { X } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [role, setRole] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setResult("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    const res = await fetch("/api/analyze", { method: "POST", body: formData });
    const data = await res.json();

    setResult(data.error ? `Error: ${data.error}` : data.output);
  }

  return (
    <main style={{ padding: 20 }}>
      {result ? (
        <div style={{ marginTop: 20 }}>
          <button
            className="mb-5 bg-amber-700 p-2 cursor-pointer hover:bg-amber-800 rounded-xs"
            onClick={() => {
              setResult("");
            }}
          >
            <X />
          </button>
          <MarkdownPreview className="markdown-preview" source={result} />
        </div>
      ) : (
        <>
          <ResumeForm
            setFile={setFile}
            file={file}
            onSubmit={handleSubmit}
            setRole={setRole}
            role={role}
          />
        </>
      )}
    </main>
  );
}
