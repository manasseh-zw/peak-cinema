import { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'

const PLACEHOLDER_SUGGESTIONS = [
  'heartwarming family adventure',
  'intense psychological thriller',
  'cozy romantic comedy',
  'mind-bending sci-fi',
  'epic fantasy quest',
  'feel-good musical',
]

interface SearchInputProps {
  onSearch: (query: string) => void
  isLoading?: boolean
}

export function SearchInput({ onSearch, isLoading = false }: SearchInputProps) {
  const [value, setValue] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true)

  // Rotate through placeholder suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaceholderVisible(false)
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length)
        setIsPlaceholderVisible(true)
      }, 150)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, 250) 

    return () => clearTimeout(timer)
  }, [value])
 

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  return (
    <InputGroup className="h-14 max-w-2xl mx-auto bg-card/50 backdrop-blur-sm rounded-full">
      <div className="flex-1 relative overflow-hidden">
        <InputGroupInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder=""
          className="text-lg pl-5"
        />

        {/* Animated placeholder */}
        {!value && (
          <div className="absolute inset-0 flex items-center pl-5 pointer-events-none">
            <span
              key={placeholderIndex}
              className={`text-muted-foreground transition-opacity duration-300 ${
                isPlaceholderVisible ? 'opacity-50 animate-fade-in-up' : 'opacity-0'
              }`}
            >
              {PLACEHOLDER_SUGGESTIONS[placeholderIndex]}
            </span>
          </div>
        )}
      </div>

      <InputGroupAddon align="inline-end" className="pr-4">
        {isLoading ? (
          <div className="w-10 h-10 flex items-center justify-center">
            <Spinner size={24} className="text-primary" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <MagnifyingGlassIcon
              size={22}
              className="text-primary"
              weight="bold"
            />
          </div>
        )}
      </InputGroupAddon>
    </InputGroup>
  )
}
