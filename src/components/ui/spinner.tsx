import { SpinnerGapIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.ComponentProps<'svg'> {
  size?: number
}

export function Spinner({ className, size = 20, ...props }: SpinnerProps) {
  return (
    <SpinnerGapIcon
      size={size}
      weight="bold"
      className={cn('animate-spin', className)}
      {...props}
    />
  )
}
