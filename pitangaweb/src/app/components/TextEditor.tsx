import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";

import { cn } from "@/lib/utils";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const TextEditor = ({
  value,
  onChange,
  className,
  placeholder = "Digite aqui...",
}: TextEditorProps) => {
  const [Quill, setQuill] = useState<any>(null);

  useEffect(() => {
    import("react-quill").then((mod) => {
      setQuill(() => mod.default);
    });
  }, []);

  if (!Quill) {
    return (
      <div
        className={cn(
          "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground",
          "flex items-center justify-center italic",
          className
        )}
      >
        Carregando editor...
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full rounded-md border border-input bg-background",
        className
      )}
    >
      <Quill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="text-editor"
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "code-block"],
            ["clean"],
          ],
        }}
      />
    </div>
  );
};
