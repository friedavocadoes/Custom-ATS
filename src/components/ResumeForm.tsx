"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { FileUpload } from "./ui/file-upload";
import { ResumeFormType } from "@/types/main";
import { Button } from "./ui/stateful-button";

export function ResumeForm({
  setFile,
  file,
  onSubmit,
  setRole,
  role,
}: ResumeFormType) {
  const placeholders = [
    "Frontend",
    "Full stack",
    "MERN Dev",
    "Business Analyst",
    "Subject Matter Expert",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
  };

  return (
    <div className="h-[40rem] flex flex-col justify-center  items-center px-4">
      <div>
        <h2 className=" text-xl text-left sm:text-5xl dark:text-white text-black">
          Step 1: Upload CV
        </h2>
        <FileUpload setFile={setFile} file={file} />
      </div>
      <div>
        <h2 className="mb-10 text-xl text-center sm:text-5xl dark:text-white text-black">
          Step 2: Target Job role
        </h2>
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
        />
      </div>
      <div className="mt-10">
        <Button
          onClick={onSubmit}
          disabled={role === ""}
          className="bg-stone-500"
        >
          Score Resume
        </Button>
      </div>
    </div>
  );
}
