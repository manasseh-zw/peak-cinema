import { motion } from 'motion/react'
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, zIndex: 10 }}
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden group ${className}`}
      style={{ aspectRatio: '2/3' }}
    >
      {/* Poster Image */}
      {metadata.posterUrl ? (
        <img
          src={metadata.posterUrl}
          alt={metadata.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-xs">No Poster</span>
        </div>
      )}

      {/* Score Badge - Top Right */}
      <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-medium text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <StarIcon weight="fill" className="text-yellow-500" size={10} />
        {(score * 100).toFixed(0)}%
      </div>

      {/* Gradient Overlay - Always visible on hover */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight drop-shadow-lg">
          {metadata.title}
        </h3>
        {year && (
          <p className="text-white/70 text-xs mt-1">{year}</p>
        )}
      </div>
    </motion.div>
  )
}
