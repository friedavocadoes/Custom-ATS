"use client";

import { useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import axios from "axios";
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

    const res = await axios.post("/api/analyze", formData);

    setResult(res.data.error ? `Error: ${res.data.error}` : res.data.output);
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

      <footer className="text-center text-sm  font-semibold">
        <p className="mb-4 text-md">
          Acquired by{" "}
          <a
            href="https://flintai.vercel.app/resumeAI"
            className="text-blue-500 hover:text-blue-700 transition-all"
          >
            Flint.ai/resumeAI
          </a>
        </p>

        <p>
          {"made with "} <span className="text-red-600">{"<3"} </span> {" by "}
          <a
            href="https://github.com/friedavocadoes"
            target="blank"
            className="text-blue-500 hover:text-blue-700 transition-all"
          >
            friedavocadoes
          </a>
        </p>
      </footer>
    </main>
  );
}
