'use client'

import {
  Content,
  Portal,
  Provider,
  Root,
  Trigger,
} from '@radix-ui/react-tooltip'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/utils'

const tooltipContentVariants = tv({
  base: 'fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-[--radix-tooltip-content-transform-origin] animate-in overflow-hidden border-2 border-border bg-background px-3 py-1.5 text-primary-foreground text-xs data-[state=closed]:animate-out',
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      primary: 'bg-primary text-primary-foreground',
      solid: 'bg-black text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const TooltipContent = forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content> &
    VariantProps<typeof tooltipContentVariants>
>(({ className, sideOffset = 4, variant, ...props }, ref) => (
  <Portal>
    <Content
      className={cn(
        tooltipContentVariants({
          variant,
          className,
        }),
      )}
      ref={ref}
      sideOffset={sideOffset}
      {...props}
    />
  </Portal>
))

TooltipContent.displayName = Content.displayName

const TooltipObject = Object.assign(Root, {
  Trigger,
  Content: TooltipContent,
  Provider,
})

export { TooltipObject as Tooltip }
