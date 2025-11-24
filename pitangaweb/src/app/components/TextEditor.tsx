import { forwardRef, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";

import { cn } from "@/lib/utils";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>(
  ({ value, onChange, className, placeholder = "Descrição do desafio..."}, ref) => {
    const [Quill, setQuill] = useState<any>(null);

    useEffect(() => {
      import("react-quill").then((mod) => {
        setQuill(() => mod.default);
      });
    }, []);

    if (!Quill) {
      return (
        <div
          ref={ref}
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
        ref={ref}
        className={cn(
          //toolbar
          '[&_.ql-toolbar.ql-snow]:rounded-t-md',
          '[&_.ql-toolbar.ql-snow]:border-border',
          '[&_.ql-toolbar.ql-snow]:border-b-0',

          '[&_.ql-toolbar.ql-snow_.ql-header.ql-picker_.ql-picker-label.ql-active]:text-primary',
          '[&_.ql-toolbar.ql-snow_.ql-header.ql-picker_.ql-picker-label.ql-active_.ql-stroke]:stroke-primary',
          '[&_.ql-toolbar.ql-snow_.ql-header.ql-picker_.ql-picker-label:hover]:text-primary',
          '[&_.ql-toolbar.ql-snow_.ql-header.ql-picker_.ql-picker-label:hover_.ql-stroke]:stroke-primary',
          '[&_.ql-toolbar.ql-snow_.ql-header.ql-picker_.ql-picker-options]:bg-background',
          '[&_.ql-toolbar.ql-snow_.ql-header.ql-picker_.ql-picker-options_.ql-picker-item]:text-foreground',
          '[&_.ql-toolbar.ql-snow_.ql-header.ql-picker_.ql-picker-options_.ql-picker-item:hover]:text-primary',

          '[&_.ql-toolbar.ql-snow_button.ql-active_.ql-stroke]:stroke-primary',
          '[&_.ql-toolbar.ql-snow_button:hover_.ql-active_.ql-stroke]:stroke-primary',
          "[&_.ql-toolbar.ql-snow_button:hover_.ql-stroke]:stroke-primary",
          "[&_.ql-toolbar.ql-snow_button:hover_.ql-fill]:fill-primary",

          // container
          '[&_.ql-container.ql-snow]:rounded-b-md',
          '[&_.ql-container.ql-snow]:border-border',

          // editor
          '[&_.ql-editor]:border-0',
          '[&_.ql-editor]:border-t',
          '[&_.ql-editor]:h-[200px]',
          '[&_.ql-editor:placeholder]:text-error',
          '[&_.ql-editor.ql-blank::before]:text-muted-foreground',

          'shadow-sm',
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
  }
);
