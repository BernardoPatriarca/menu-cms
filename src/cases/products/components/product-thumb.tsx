import { useState } from "react"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductThumbProps {
  src?: string | null
  alt: string
  className?: string
}

/** Miniatura do produto, com ícone de reserva se não houver imagem ou ela falhar. */
export function ProductThumb({ src, alt, className }: ProductThumbProps) {
  // Guarda qual URL falhou; ao trocar de URL a imagem é tentada de novo.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = Boolean(src) && failedSrc !== src

  return (
    <div
      className={cn(
        "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground",
        className,
      )}
    >
      {showImage ? (
        <img
          src={src!}
          alt={alt}
          loading="lazy"
          onError={() => setFailedSrc(src!)}
          className="size-full object-cover"
        />
      ) : (
        <ImageOff className="size-5" aria-label="Sem imagem" />
      )}
    </div>
  )
}
