import { useState } from 'react'
import { StarIcon } from '@phosphor-icons/react'
import type { SearchResult } from '@/lib/search'

interface MoviePosterProps {
  movie: SearchResult
  onClick?: () => void
  className?: string
}

export function MoviePoster({ movie, onClick, className }: MoviePosterProps) {
  const { metadata, score } = movie
  const year = metadata.releaseDate?.slice(0, 4) ?? ''
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden group transition-transform duration-300 hover:scale-[1.03] hover:z-10 ${className}`}
      style={{ aspectRatio: '2/3' }}
    >
      {/* Loading placeholder - dark with gradient */}
      {metadata.posterUrl && !isLoaded && (
        <div className="absolute inset-0 bg-zinc-900">
          <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-white/5 animate-pulse" />
        </div>
      )}

      {/* Poster Image */}
      {metadata.posterUrl ? (
        <img
          src={metadata.posterUrl}
          alt={metadata.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-xs">No Poster</span>
        </div>
      )}

      {/* Score Badge - Top Right: Always visible while loading, hover-only when loaded */}
      <div
        className={`absolute top-2 right-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-medium text-white flex items-center gap-1 transition-opacity duration-300 ${
          isLoaded ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        <StarIcon weight="fill" className="text-yellow-500" size={10} />
        {(score * 100).toFixed(0)}%
      </div>

      {/* Gradient Overlay: Always visible while loading, hover-only when loaded */}
      <div
        className={`absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent transition-opacity duration-300 ${
          isLoaded ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      />

      {/* Info Overlay: Always visible while loading, hover-only when loaded */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${
          isLoaded ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight drop-shadow-lg">
          {metadata.title}
        </h3>
        {year && <p className="text-white/70 text-xs mt-1">{year}</p>}
      </div>
    </div>
  )
}
