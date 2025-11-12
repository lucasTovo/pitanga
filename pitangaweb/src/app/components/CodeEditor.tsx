import { useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/theme-chaos'
import 'ace-builds/src-noconflict/ext-language_tools'

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

  return size
}

type CodeEditorProps = {
  fontSize?: number
  value?: string
  className?: string
  onChange: (code: string) => void
}

export const CodeEditor = ({
  fontSize = 16,
  value = '',
  className = '',
  onChange,
}: CodeEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useResizeObserver(containerRef)

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[200px] rounded-xl overflow-hidden border border-border bg-background ${className}`}
    >
      <AceEditor
        mode="java"
        theme="chaos"
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
          enableSnippets: true,
          tabSize: 2,
          showLineNumbers: true,
        }}
        editorProps={{ $blockScrolling: true }}
        onChange={(val) => onChange(val)}
        style={{
          backgroundColor: 'transparent',
        }}
      />
    </div>
  )
}
