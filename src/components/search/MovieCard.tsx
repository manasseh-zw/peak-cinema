import { StarIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { SearchResult } from '@/lib/search'

interface MovieCardProps {
  movie: SearchResult
  onClick?: () => void
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const { metadata, score } = movie
  const year = metadata.releaseDate?.slice(0, 4) ?? 'N/A'

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Poster */}
      <div className="relative aspect-2/3 overflow-hidden">
        {metadata.posterUrl ? (
          <img
            src={metadata.posterUrl}
            alt={metadata.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Poster</span>
          </div>
        )}

        {/* Score Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
          <StarIcon weight="fill" className="text-yellow-500" size={12} />
          {(score * 100).toFixed(0)}%
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
          {metadata.title}
        </h3>

        <p className="text-xs text-muted-foreground">{year}</p>

        {/* Genres */}
        {metadata.genres && metadata.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {metadata.genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-[10px] px-1.5 py-0">
                {genre}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
