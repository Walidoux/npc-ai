'use client'

import { Root, type SwitchProps, Thumb } from '@radix-ui/react-switch'
import { cn } from '@/utils/index'

const Switch = ({ className, ...props }: SwitchProps) => (
  <Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center border-2 border-foreground disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary',
      className
    )}
    {...props}>
    <Thumb
      className={cn(
        'pointer-events-none mx-0.5 block h-4 w-4 border-2 border-foreground bg-primary ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-background'
      )}
    />
  </Root>
)

export { Switch }
