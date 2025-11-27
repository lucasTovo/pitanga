import { forwardRef, useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-dracula'
import 'ace-builds/src-noconflict/ext-language_tools'

import { cn } from '@/lib/utils'
import { useTailwindBreakpoint } from '@/app/hooks/useTailwindBreakpoint'

import { useTheme } from '@/app/theme/useTheme'
import { ResolvedTheme } from '@/app/theme/ThemeProvider'

function useResizeObserver(ref: React.RefObject<HTMLElement>) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return
    const element = ref.current

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        })
      }
    })

    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [ref])

  return size;
}

const editorTheme: Record<ResolvedTheme, string> = {
  light: 'chrome',
  dark: 'dracula',
}

type CodeEditorProps = {
  value?: string;
  className?: string;
  onChange: (code: string) => void;
  readOnly?: boolean;
}

export const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(
  ({ value = '', className = '', onChange, readOnly = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const { width, height } = useResizeObserver(containerRef)
    const { resolvedTheme } = useTheme();

    const breakpoint = useTailwindBreakpoint();
    const fontSize = breakpoint === 'sm' ? 14 : 16;

    useEffect(() => {
      if (!ref) return
      if (typeof ref === 'function') ref(containerRef.current)
      else ref.current = containerRef.current
    }, [ref])

    return (
      <div
        ref={containerRef}
        className={cn(
          'relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-border shadow-sm grow',
          className,
        )}
      >
        <AceEditor
          readOnly={readOnly}
          mode="java"
          theme={editorTheme[resolvedTheme]}
          name="code-editor"
          value={value}
          fontSize={fontSize}
          width={`${width}px`}
          height={`${height}px`}
          showPrintMargin={false}
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            tabSize: 2,
            showLineNumbers: true,
          }}
          editorProps={{ $blockScrolling: true }}
          onChange={(val) => onChange(val)}
        />
      </div>
    );
  }
);
