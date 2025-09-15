import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const role = await form.get("role");
    const jd = await form.get("jd");
    const text = `You are an **ATS (Applicant Tracking System) Resume Evaluator**.

The candidate is applying for the role of **${role}**.  
${jd && `Job Description (for context): ${jd}`}

You will receive the candidate's resume as a **PDF**.

### Your Output (in Markdown):
# **ATS Score (for ${role}): XX/100**

Provide ONLY the following sections, each brutally concise and critical:

## 🔑 Key Fixes (Top Priorities)
- List the **3–5 most urgent changes** needed to beat ATS and recruiters (missing keywords, weak phrasing, format issues, metrics, etc.).  
- Be blunt and actionable—no generic advice.

## ✅ Strengths
- 3–5 specific points where the resume performs well (structure, impact, role alignment, quantifiable results, etc.).

## ⚡ Keyword Match
- **Present:** Important keywords/skills from the job description already in the resume.  
- **Missing:** High-value keywords/skills that are absent or weak.

## 🏁 Verdict
- A **2–3 sentence** direct summary of the resume’s chances (e.g., “Likely rejected without X,” or “Strong ATS pass but weak recruiter appeal”).

### Rules
- Be **role-aware**.  
- Avoid fluff or explanations—**only critical insights**.  
- Use **Markdown headings and bullet points** for clarity.
`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text },
            { inlineData: { data: base64, mimeType: "application/pdf" } },
          ],
        },
      ],
    });

    return NextResponse.json({ output: response.text });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
