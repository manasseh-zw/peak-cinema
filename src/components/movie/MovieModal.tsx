import { XIcon, StarIcon, CalendarIcon } from '@phosphor-icons/react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SearchResult } from '@/lib/search'

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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Poster */}
          <div className="w-full md:w-1/3 shrink-0">
            {metadata.posterUrl ? (
              <img
                src={metadata.posterUrl}
                alt={metadata.title}
                className="w-full h-48 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-48 md:h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No Poster</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3"
              onClick={() => onOpenChange(false)}
            >
              <XIcon size={20} />
            </Button>

            {/* Title */}
            <AlertDialogTitle className="text-xl font-bold pr-8">
              {metadata.title}
            </AlertDialogTitle>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarIcon size={14} />
                {year}
              </span>

              {metadata.voteAverage && (
                <span className="flex items-center gap-1">
                  <StarIcon weight="fill" className="text-yellow-500" size={14} />
                  {metadata.voteAverage.toFixed(1)}
                </span>
              )}

              {metadata.voteCount && (
                <span className="text-xs">({metadata.voteCount.toLocaleString()} votes)</span>
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
            <AlertDialogDescription className="text-sm leading-relaxed max-h-48 overflow-y-auto">
              {movie.overview || 'No overview available.'}
            </AlertDialogDescription>

            {metadata.originalLanguage && (
              <p className="text-xs text-muted-foreground">
                Original Language: {metadata.originalLanguage.toUpperCase()}
              </p>
            )}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
