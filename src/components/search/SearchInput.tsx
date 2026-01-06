import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

interface SearchInputProps {
  onSearch: (query: string) => void
  isLoading?: boolean
  placeholder?: string
}

export function SearchInput({
  onSearch,
  isLoading = false,
  placeholder = "Search by vibes... e.g., 'heartwarming family adventure'",
}: SearchInputProps) {
  const [value, setValue] = useState('')
  const [debouncedValue, setDebouncedValue] = useState('')

  // Debounce the input value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, 300)

    return () => clearTimeout(timer)
  }, [value])

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  return (
    <InputGroup className="h-14 max-w-2xl mx-auto bg-card/50 backdrop-blur-sm">
      <InputGroupAddon align="inline-start">
        <MagnifyingGlassIcon size={20} />
      </InputGroupAddon>

      <InputGroupInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="text-lg"
      />

      {isLoading && (
        <InputGroupAddon align="inline-end">
          <SpinnerGapIcon size={20} className="animate-spin" />
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
