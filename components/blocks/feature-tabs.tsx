'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, ArrowUpRight } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface FeatureTabsProps {
  title: string;
  tabs: TabItem[];
  defaultTabIndex?: number;
  onTabChange?: (id: string) => void;
  className?: string;
}

const violetHsl = 'hsl(270, 65%, 55%)';
const violetDark = 'hsl(270, 70%, 45%)';

export default function FeatureTabs({
  title,
  tabs,
  defaultTabIndex = 0,
  onTabChange,
  className,
}: FeatureTabsProps) {
  const [activeId, setActiveId] = React.useState(
    tabs[defaultTabIndex]?.id || tabs[0]?.id
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, id: string) => {
    if (!tabs.length) return;

    const currentIndex = tabs.findIndex((t) => t.id === activeId);
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setActiveId(tabs[(currentIndex + 1) % tabs.length].id);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setActiveId(tabs[(currentIndex - 1 + tabs.length) % tabs.length].id);
        break;
    }
  };

  const handleTabClick = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onTabChange) return;
    
    onTabChange(id);
    setActiveId(id);
    
    // Focus the clicked tab for better accessibility
    (e.target as HTMLButtonElement).focus();
  };

  const activeTab = tabs.find(t => t.id === activeId) || tabs[0];

  return (
    <Card className={cn(
      'border-border bg-background overflow-hidden',
      className
    )}>
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
          {activeTab.description && (
            <Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
              {activeTab.description}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Tabs Navigation */}
        <nav 
          role="tablist" 
          aria-label={title}
          onKeyDown={(e) => handleKeyDown(e, activeId)}
          className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent py-2 -mx-4 px-4"
        >
          {tabs.map((tab, index) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={(e) => handleTabClick(tab.id, e)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              role="tab"
              aria-selected={activeId === tab.id}
              id={`tab-${tab.id}`}
              className={cn(
                'flex-shrink-0 px-4 py-3 rounded-lg transition-all duration-200',
                activeId === tab.id ? 
                  'bg-primary text-primary-foreground shadow-sm' : 
                  'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              <span className={cn(
                'truncate',
                activeId === tab.id ? 'font-medium' : ''
              )}>
                {tab.label}
              </span>
            </Button>
          ))}

          {/* Add new tab button */}
          <Button 
            variant="ghost" 
            className="flex-shrink-0 px-3 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50"
            aria-label="Add new feature tab"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </nav>

        {/* Main Content Area */}
        <div 
          role="tabpanel"
          aria-labelledby={`tab-${activeId}`}
          className="min-h-[200px] animate-in fade-in duration-300"
        >
          {activeTab.description && (
            <p className="text-muted-foreground leading-relaxed">
              {activeTab.description}
            </p>
          )}

          {/* Default content when no description */}
          {!activeTab.description && (
            <div className="flex items-center justify-center h-full min-h-[150px] text-muted-foreground">
              <span className="text-sm">Select a tab to view details</span>
            </div>
          )}
        </div>

        {/* Quick actions below tabs */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-6">
          <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-primary">
            Edit Features
          </Button>

          <div className="flex items-center gap-2">
            {tabs.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setActiveId(tabs[0].id)}
                  aria-label="Go to first tab"
                  disabled={activeId === tabs[0].id}
                  className="h-8 w-8 rounded-full bg-muted/50 text-muted-foreground hover:text-primary"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setActiveId(tabs[tabs.length - 1].id)}
                  aria-label="Go to last tab"
                  disabled={activeId === tabs[tabs.length - 1].id}
                  className="h-8 w-8 rounded-full bg-muted/50 text-muted-foreground hover:text-primary"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveId(tabs[0].id)}
              disabled={activeId === tabs[0].id}
              className="border-border text-muted-foreground hover:text-primary ml-2"
            >
              Reset to first tab
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
