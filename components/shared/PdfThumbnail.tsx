'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PdfThumbnailProps {
  url: string
  className?: string
  scale?: number
  alt?: string
}

export function PdfThumbnail({ url, className, scale = 1.2, alt }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false
    let renderTask: { cancel: () => void } | null = null

    async function render() {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

        const loadingTask = pdfjs.getDocument({ url })
        const pdf = await loadingTask.promise
        if (cancelled) return

        const page = await pdf.getPage(1)
        if (cancelled) return

        const viewport = page.getViewport({ scale })
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.floor(viewport.width * dpr)
        canvas.height = Math.floor(viewport.height * dpr)
        canvas.style.width = '100%'
        canvas.style.height = 'auto'
        ctx.scale(dpr, dpr)

        const task = page.render({
          canvasContext: ctx,
          viewport,
        })
        renderTask = task as unknown as { cancel: () => void }
        await task.promise
        if (!cancelled) setStatus('ready')
      } catch (err) {
        if (!cancelled) {
          console.error('PDF render error:', err)
          setStatus('error')
        }
      }
    }

    render()

    return () => {
      cancelled = true
      try {
        renderTask?.cancel()
      } catch {
        // ignore
      }
    }
  }, [url, scale])

  return (
    <div
      className={cn(
        'relative flex w-full items-center justify-center overflow-hidden bg-[color:var(--muted)]',
        className
      )}
      aria-label={alt}
    >
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[color:var(--muted-foreground)]" />
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[color:var(--muted-foreground)]">
          <FileText className="h-10 w-10" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={cn(
          'block h-auto w-full transition-opacity duration-300',
          status === 'ready' ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  )
}
