import { cn, tv, type VariantProps } from 'tailwind-variants'

const textVariants = tv({
  base: 'font-head',
  variants: {
    as: {
      p: 'font-head text-base',
      li: 'font-head text-base',
      a: 'font-head text-base decoration-primary underline-offset-2 hover:underline',
      h1: 'font-bold text-4xl lg:text-5xl',
      h2: 'font-semibold text-3xl lg:text-4xl',
      h3: 'font-medium text-2xl',
      h4: 'font-normal text-xl',
      h5: 'font-normal text-lg',
      h6: 'font-normal text-base',
    },
  },
  defaultVariants: {
    as: 'p',
  },
})

interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'className'>,
    VariantProps<typeof textVariants> {
  className?: string
  as?: React.ElementType
}

export const Text = (props: TextProps) => {
  const { className, as, ...otherProps } = props
  const Tag: React.ElementType = as || 'p'

  return <Tag className={cn(textVariants({ as }), className)} {...otherProps} />
}
