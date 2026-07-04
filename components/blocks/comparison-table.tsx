'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Check, X, ChevronRight, Star, Zap, Shield, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface ComparisonTableProps {
  plans: Array<{
    name: string
    price: string | number
    features: string[]
    recommended?: boolean
    ctaText?: string
    href?: string
  }>
  title?: string
  subtitle?: string
  highlightFeature?: string
}

export interface ComparisonTableState {
  expandedRow: string | null
}

const DEFAULT_PLANS: ComparisonTableProps['plans'] = [
  {
    name: 'Starter',
    price: '$29/mo',
    features: ['5 AI projects', 'Basic templates', 'Community support', '10GB storage'],
    ctaText: 'Get Started'
  },
  {
    name: 'Pro',
    price: '$79/mo',
    recommended: true,
    features: [
      'Unlimited AI projects',
      'Premium templates',
      'Priority support',
      '100GB storage',
      'Advanced analytics'
    ],
    ctaText: 'Start Free Trial',
    href: '/pricing/pro'
  },
  {
    name: 'Enterprise',
    price: '$299/mo',
    features: [
      'Everything in Pro',
      'Custom models',
      'Dedicated support',
      'Unlimited storage',
      'SSO & SAML'
    ],
    ctaText: 'Contact Sales',
    href: '/pricing/enterprise'
  }
]

const DEFAULT_STATE: ComparisonTableState = {
  expandedRow: null
}

export function ComparisonTable({
  plans = DEFAULT_PLANS,
  title = 'Choose Your Plan',
  subtitle = 'Build faster with AI. Scale as you grow.',
  highlightFeature = 'Unlimited projects'
}: ComparisonTableProps) {
  const [state, setState] = React.useState<ComparisonTableState>(DEFAULT_STATE)

  const toggleRow = (name: string) => {
    setState(prev => ({ expandedRow: prev.expandedRow === name ? null : name }))
  }

  return (
    <Card className="border-border bg-background shadow-sm">
      <CardContent className="p-6 md:p-8">
        <div className="mb-8 space-y-2">
          {title && <h3 className="text-xl font-semibold text-primary">{title}</h3>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-10 bg-background p-4 text-left font-medium text-primary md:w-64">
                  Plan
                </th>
                {plans.map((plan, index) => (
                  <th 
                    key={index} 
                    scope="col" 
                    className={cn(
                      "p-4 text-center",
                      plan.recommended && "bg-primary/5 ring-2 ring-primary rounded-l-lg md:rounded-none"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {plan.price}
                      {plan.recommended && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                          Most Popular
                        </Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {plans.map((plan, index) => (
                <tr 
                  key={index} 
                  className={cn(
                    "hover:bg-muted/50 transition-colors",
                    plan.recommended && "bg-primary/10"
                  )}
                >
                  <td className="sticky left-0 z-10 bg-background p-4 text-left font-medium text-primary md:w-64">
                    <div className="flex items-center gap-3">
                      {plan.recommended && (
                        <Sparkles className="h-5 w-5 text-yellow-400 shrink-0" />
                      )}
                      <span>{plan.name}</span>
                      {plan.href && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto h-8 px-2"
                          asChild
                        >
                          <a href={plan.href}>Details →</a>
                        </Button>
                      )}
                    </div>
                  </td>

                  {plans.map((_, colIndex) => (
                    <td key={colIndex} className="p-4 text-center">
                      <ul className="space-y-1.5">
                        {plan.features.map((feature, fIndex) => {
                          const isHighlighted = highlightFeature && feature.toLowerCase().includes(highlightFeature.toLowerCase())
                          return (
                            <li 
                              key={fIndex} 
                              className={cn(
                                "flex items-center justify-center gap-2 text-sm",
                                isHighlighted ? "text-primary font-medium" : "text-muted-foreground"
                              )}
                            >
                              {isHighlighted && <Zap className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />}
                              {feature}
                            </li>
                          )
                        })}
                      </ul>
                    </td>
                  ))}

                  <td className="p-4">
                    <Button 
                      variant={plan.recommended ? "default" : "outline"} 
                      size="sm"
                      asChild
                    >
                      {plan.href && plan.ctaText ? (
                        <a href={plan.href}>{plan.ctaText}</a>
                      ) : plan.ctaText ? (
                        <span>{plan.ctaText}</span>
                      ) : null}
                    </Button>
                  </td>
                </tr>
              ))}

              <tr className="border-t border-border">
                <td colSpan={plans.length + 1} className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>30-day money-back guarantee on all plans</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {plans.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
            <span>Compare all features side-by-side</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
