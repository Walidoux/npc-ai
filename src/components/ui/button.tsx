import { Slot } from '@radix-ui/react-slot'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/utils'

export const buttonVariants = tv({
  base: 'flex cursor-pointer select-none items-center rounded font-head font-medium outline-hidden transition-all duration-200',

  variants: {
    variant: {
      default:
        'border-2 border-black bg-primary text-primary-foreground shadow-md transition hover:translate-y-1 hover:bg-primary-hover hover:shadow active:translate-x-1 active:translate-y-2 active:shadow-none',
      secondary:
        'border-2 border-black bg-secondary text-secondary-foreground shadow-md shadow-primary transition hover:translate-y-1 hover:bg-secondary-hover hover:shadow active:translate-x-1 active:translate-y-2 active:shadow-none',
      outline:
        'border-2 bg-transparent shadow-md transition hover:translate-y-1 hover:shadow active:translate-x-1 active:translate-y-2 active:shadow-none',
      link: 'bg-transparent hover:underline',
      ghost: 'bg-transparent hover:bg-accent',
    },
    size: {
      sm: 'px-3 py-1 text-sm shadow hover:shadow-none',
      md: 'px-4 py-1.5 text-base',
      lg: 'px-6 py-2 text-md lg:px-8 lg:py-3 lg:text-lg',
      icon: 'p-2',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
})

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      children,
      size = 'md',
      className = '',
      variant = 'default',
      asChild = false,
      ...props
    }: IButtonProps,
    forwardedRef,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={forwardedRef}
        {...props}>
        {children}
      </Comp>
    )
  },
)

Button.displayName = 'Button'
