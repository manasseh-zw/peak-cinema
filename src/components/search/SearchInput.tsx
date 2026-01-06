import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MagnifyingGlassIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

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

  // Rotate through placeholder suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Debounce the input value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, 150)

    return () => clearTimeout(timer)
  }, [value])

  // Trigger search when debounced value changes
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
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground "
              >
                {PLACEHOLDER_SUGGESTIONS[placeholderIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        )}
      </div>

      <InputGroupAddon align="inline-end" className="pr-2">
        {isLoading ? (
          <SpinnerGapIcon size={24} className="animate-spin text-primary" />
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
