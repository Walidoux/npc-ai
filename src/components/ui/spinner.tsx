import { cn } from '../../utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export const Spinner = ({ className, size = 'md', ...props }: SpinnerProps) => (
  <div
    className={cn(
      'animate-spin rounded-full border-2 border-black/30 border-t-black',
      {
        'h-4 w-4': size === 'sm',
        'h-6 w-6': size === 'md',
        'h-8 w-8': size === 'lg',
      },
      className,
    )}
    {...props}
  />
)
