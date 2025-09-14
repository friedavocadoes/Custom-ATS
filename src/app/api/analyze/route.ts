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
    const text = `You are an expert ATS (Applicant Tracking System) evaluator.

        The candidate has applied for the role of ${role}.
        ${jd && `Job Description: ${jd}`}

        You will receive the candidate's resume as a PDF.

        Your tasks:
        1. **ATS Compatibility Score** - Give a percentage (0-100) that reflects how well this resume would pass an ATS scan for the given role. make sure the score is in the biggest font size for markdown. (eg. # Score: 89/100)  
        2. **Areas for Improvement** - List 3-5 actionable improvements (e.g., missing role-specific keywords, formatting tweaks, measurable impact).  
        3. **Keyword & Skills Match** - Identify critical keywords or technologies for ${role} that are present, and list important ones that are missing.  
        4. **Strengths** - List 3-5 concrete strengths of this resume (structure, quantifiable achievements, relevant tech stack, formatting, etc.).  
        5. **Overall Verdict** - Give a 2-3 sentence human-readable summary of how likely this resume is to pass ATS filters and impress recruiters.

        Guidelines:
        - Be specific and role-aware.  
        - Use **Markdown** with clear headings and bullet points.  
        - Keep feedback constructive and concise.
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
