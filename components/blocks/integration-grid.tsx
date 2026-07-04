import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkIcon, CheckCircle2Icon, ArrowRightIcon } from 'lucide-react'

export interface IntegrationGridProps {
  items: Array<{
    id: string
    name: string
    logoUrl?: string
    description: string
    category: string
    verified?: boolean
    link?: string
    ctaText?: string
    ctaVariant?: 'default' | 'primary' | 'outline'
  }>
  columns?: number
  showLogos?: boolean
  showVerifiedBadge?: boolean
}

export const IntegrationGrid = ({
  items,
  columns = 3,
  showLogos = true,
  showVerifiedBadge = false,
}: IntegrationGridProps) => {
  return (
    <div className="grid gap-6 md:gap-8 lg:gap-12">
      {items.map((item) => (
        <Card key={item.id} className="group relative overflow-hidden border-border bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-background h-full flex flex-col">
          <CardContent className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col items-center text-center space-y-4">
            {showLogos && item.logoUrl ? (
              <div 
                className={cn(
                  "h-12 w-auto transition-transform duration-300 group-hover:scale-110",
                  item.verified ? 'rounded-lg bg-muted p-2' : ''
                )}
              >
                <img
                  src={item.logoUrl}
                  alt={`${item.name} logo`}
                  className="h-full max-h-[48px] object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <div 
                className={cn(
                  "h-12 w-auto rounded-lg bg-muted p-3 transition-transform duration-300 group-hover:scale-110",
                  item.verified ? 'text-primary' : ''
                )}
              >
                {item.verified && <CheckCircle2Icon className="h-full text-primary" />}
              </div>
            )}

            <div className="space-y-3 flex-1">
              <div className={cn(
                "text-lg font-semibold tracking-tight transition-colors duration-200",
                item.verified ? 'text-primary' : 'text-foreground',
                item.verified && !showLogos ? 'flex items-center gap-2 justify-center' : ''
              )}>
                {item.name}
                {showVerifiedBadge && item.verified && (
                  <Badge variant="secondary" className="ml-2">
                    <CheckCircle2Icon className="h-3 w-3 mr-1 text-primary" />
                    Verified
                  </Badge>
                )}
              </div>

              <p className={cn(
                "text-sm leading-relaxed transition-colors duration-200",
                item.verified ? 'text-muted-foreground' : 'text-foreground/80'
              )}>
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between w-full pt-4 border-t border-border/50">
              <Badge variant="outline" className={cn(
                "text-xs uppercase tracking-wider",
                item.verified ? 'border-primary/30 text-primary' : ''
              )}>
                {item.category}
              </Badge>

              {item.link && (
                <Button 
                  asChild
                  variant={item.ctaVariant || 'default'}
                  size="sm"
                  className="h-9 px-4 gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {item.ctaText ? (
                    <>
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                      {item.ctaText}
                    </>
                  ) : (
                    <ExternalLinkIcon className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
