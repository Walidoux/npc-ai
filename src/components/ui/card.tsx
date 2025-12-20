import { Text } from '@/components/ui/text'
import { cn } from '@/utils/index'

interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const Card = ({ className, ...props }: ICardProps) => (
  <div
    className={cn(
      'inline-block rounded border-2 bg-card shadow-md transition-all hover:shadow-none',
      className,
    )}
    {...props}
  />
)

const CardHeader = ({ className, ...props }: ICardProps) => (
  <div
    className={cn('flex flex-col justify-start p-4', className)}
    {...props}
  />
)

const CardTitle = ({ className, ...props }: ICardProps) => (
  <Text as='h3' className={cn('mb-2', className)} {...props} />
)

const CardDescription = ({ className, ...props }: ICardProps) => (
  <p className={cn('text-muted-foreground', className)} {...props} />
)

const CardContent = ({ className, ...props }: ICardProps) => (
  <div className={cn('p-4', className)} {...props} />
)

const CardComponent = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
})

export { CardComponent as Card }
