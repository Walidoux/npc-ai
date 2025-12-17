'use client'

import type { DialogTitleProps } from '@radix-ui/react-dialog'
import { Close as CloseIcon } from '@nsmr/pixelart-react'
import { Content, Description, Overlay, Portal, Root, Title, Trigger } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/utils'

const Dialog = Root
const DialogTrigger = Trigger

const overlayVariants = tv({
  base: `fixed bg-black/80 font-head
    data-[state=open]:fade-in-0
    data-[state=open]:animate-in 
    data-[state=closed]:animate-out 
    data-[state=closed]:fade-out-0 
  `,

  variants: {
    variant: {
      default: 'inset-0 z-50 bg-black/85',
      none: 'fixed bg-transparent'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

interface IDialogBackgroupProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof overlayVariants> {}

const DialogBackdrop = forwardRef<HTMLDivElement, IDialogBackgroupProps>(
  (inputProps: IDialogBackgroupProps, forwardedRef) => {
    const { variant = 'default', className, ...props } = inputProps
    return <Overlay className={cn(overlayVariants({ variant }), className)} ref={forwardedRef} {...props} />
  }
)

DialogBackdrop.displayName = 'DialogBackdrop'

const dialogVariants = tv({
  base: `fixed left-[50%] top-[50%] z-50 grid rounded overflow-hidden w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-2 bg-background shadow-lg duration-200 
  data-[state=open]:animate-in 
  data-[state=open]:fade-in-0 
  data-[state=open]:zoom-in-95 
  data-[state=closed]:animate-out 
  data-[state=closed]:fade-out-0 
  data-[state=closed]:zoom-out-95`,

  variants: {
    size: {
      auto: 'max-w-fit',
      sm: 'lg:max-w-[30%]',
      md: 'lg:max-w-[40%]',
      lg: 'lg:max-w-[50%]',
      xl: 'lg:max-w-[60%]',
      '2xl': 'lg:max-w-[70%]',
      '3xl': 'lg:max-w-[80%]',
      '4xl': 'lg:max-w-[90%]',
      screen: 'max-w-full'
    }
  },
  defaultVariants: {
    size: 'auto'
  }
})

interface IDialogContentProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dialogVariants> {
  overlay?: IDialogBackgroupProps
}

const DialogContent = forwardRef<HTMLDivElement, IDialogContentProps>(
  (inputProps: IDialogContentProps, forwardedRef) => {
    const { children, size = 'auto', className, overlay, ...props } = inputProps

    return (
      <Portal>
        <DialogBackdrop {...overlay} />
        <Content className={cn(dialogVariants({ size }), className)} ref={forwardedRef} {...props}>
          <VisuallyHidden>
            <Title />
          </VisuallyHidden>
          <div className='relative flex flex-col'>{children}</div>
        </Content>
      </Portal>
    )
  }
)
DialogContent.displayName = 'DialogContent'

interface IDialogDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}
const DialogDescription = ({ children, className, ...props }: IDialogDescriptionProps) => (
  <Description className={cn(className)} {...props}>
    {children}
  </Description>
)

const dialogFooterVariants = tv({
  base: 'flex min-h-12 items-center justify-end gap-4 border-t-2 px-4 py-2',
  variants: {
    variant: {
      default: 'bg-background text-foreground'
    },
    position: {
      fixed: 'sticky bottom-0',
      static: 'static'
    }
  },
  defaultVariants: {
    position: 'fixed'
  }
})

export interface IDialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogFooterVariants> {}

const DialogFooter = ({ children, className, position, variant, ...props }: IDialogFooterProps) => (
  <div className={cn(dialogFooterVariants({ position, variant }), className)} {...props}>
    {children}
  </div>
)

const dialogHeaderVariants = tv({
  base: 'flex min-h-12 items-center justify-between border-b-2 px-4',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground'
    },
    position: {
      fixed: 'sticky top-0',
      static: 'static'
    }
  },
  defaultVariants: {
    variant: 'default',
    position: 'static'
  }
})

const DialogHeaderDefaultLayout = ({ children }: React.PropsWithChildren) => (
  <>
    {children}
    <DialogTrigger asChild className='cursor-pointer' title='Close pop-up'>
      <CloseIcon />
    </DialogTrigger>
  </>
)

interface IDialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogHeaderVariants>,
    DialogTitleProps {
  asChild?: boolean
}

const DialogHeader = ({ children, className, position, variant, asChild, ...props }: IDialogHeaderProps) => (
  <div className={cn(dialogHeaderVariants({ position, variant }), className)} {...props}>
    {asChild ? children : <DialogHeaderDefaultLayout>{children}</DialogHeaderDefaultLayout>}
  </div>
)

const DialogComponent = Object.assign(Dialog, {
  Trigger: DialogTrigger,
  Header: DialogHeader,
  Content: DialogContent,
  Description: DialogDescription,
  Footer: DialogFooter
})

export { DialogComponent as Dialog }
