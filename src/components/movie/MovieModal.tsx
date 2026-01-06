import { CalendarIcon, StarIcon, XIcon } from '@phosphor-icons/react'
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import type { SearchResult } from '@/lib/search'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MovieModalProps {
  movie: SearchResult | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MovieModal({ movie, open, onOpenChange }: MovieModalProps) {
  if (!movie) return null

  const { metadata } = movie
  const year = metadata.releaseDate?.slice(0, 4) ?? 'N/A'

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        {/* Aggressive blur overlay */}
        <AlertDialogPrimitive.Backdrop
          className={cn(
            'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0',
            'bg-black/90 backdrop-blur-md fixed inset-0 z-50',
          )}
        />

        {/* Modal content - no rounded corners, larger */}
        <AlertDialogPrimitive.Popup
          className={cn(
            'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0',
            'data-closed:zoom-out-95 data-open:zoom-in-95',
            'bg-background fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-[90vw] max-w-3xl max-h-[85vh] overflow-hidden outline-none',
          )}
        >
          <div className="flex flex-col md:flex-row h-full">
            {/* Poster - larger, square corners */}
            <div className="w-full md:w-2/5 shrink-0 bg-black">
              {metadata.posterUrl ? (
                <img
                  src={metadata.posterUrl}
                  alt={metadata.title}
                  className="w-full h-56 md:h-full object-cover"
                  style={{ aspectRatio: '2/3' }}
                />
              ) : (
                <div className="w-full h-56 md:h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No Poster</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => onOpenChange(false)}
              >
                <XIcon size={20} />
              </Button>

              {/* Title */}
              <AlertDialogPrimitive.Title className="text-xl font-bold pr-8">
                {metadata.title}
              </AlertDialogPrimitive.Title>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarIcon size={14} />
                  {year}
                </span>

                {metadata.voteAverage && (
                  <span className="flex items-center gap-1">
                    <StarIcon
                      weight="fill"
                      className="text-yellow-500"
                      size={14}
                    />
                    {metadata.voteAverage.toFixed(1)}
                  </span>
                )}

                {metadata.voteCount && (
                  <span className="text-xs">
                    ({metadata.voteCount.toLocaleString()} votes)
                  </span>
                )}
              </div>

              {/* Genres */}
              {metadata.genres && metadata.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {metadata.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Overview */}
              <AlertDialogPrimitive.Description className="text-sm leading-relaxed text-muted-foreground">
                {movie.overview || 'No overview available.'}
              </AlertDialogPrimitive.Description>

              {metadata.originalLanguage && (
                <p className="text-xs text-muted-foreground/70">
                  Original Language: {metadata.originalLanguage.toUpperCase()}
                </p>
              )}
            </div>
          </div>
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
