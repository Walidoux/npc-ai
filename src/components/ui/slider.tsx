'use client'

import { Range, Root, Thumb, Track } from '@radix-ui/react-slider'
import { cn } from 'tailwind-variants'

const Slider = forwardRef<
  React.ComponentRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className,
    )}
    ref={ref}
    {...props}>
    <Track className='relative h-3 w-full grow overflow-hidden border-2 bg-background'>
      <Range className='absolute h-full bg-primary' />
    </Track>
    <Thumb className='block h-4.5 w-4.5 border-2 bg-background shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' />
  </Root>
))
Slider.displayName = Root.displayName

export { Slider }
