export interface FileType {
  setFile: (file: File | null) => void;
  file: File | null;
}

export interface ResumeFormType extends FileType {
  onSubmit: (e: React.FormEvent) => void;
  setRole: (role: string) => void;
  role: string;
}
