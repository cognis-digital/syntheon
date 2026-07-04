'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Plus, GripVertical, MoreHorizontal, Search, Filter, 
  ChevronRight, Clock, AlertCircle, CheckCircle2, 
  Calendar, Tag, Dots, ArrowUpRight, X
} from 'lucide-react';

export interface KanbanCardProps {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  dueDate?: string;
  assignee?: string;
}

export interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  cards: KanbanCardProps[];
  onDrop: (cardId: string, fromStatus: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
}

export interface KanbanBoardProps {
  columns: KanbanColumnProps[];
  onCardCreate?: (title: string, description?: string) => void;
  onCardDelete?: (cardId: string) => void;
  onCardMove?: (cardId: string, toStatus: string) => void;
}

const DEFAULT_COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#8b5cf6' }, // violet-500
  { id: 'in-progress', title: 'In Progress', color: '#a78bfa' }, // violet-400
  { id: 'review', title: 'Review', color: '#c4b5fd' }, // violet-300
  { id: 'done', title: 'Done', color: '#d8b4fe' }, // violet-200
];

const PRIORITY_COLORS = {
  low: '#e2e8f0',   // slate-200
  medium: '#fef3c7', // amber-100
  high: '#fed7aa',   // orange-100
  critical: '#fecaca', // red-100
};

const PRIORITY_ICONS = {
  low: CheckCircle2,
  medium: Clock,
  high: AlertCircle,
  critical: AlertCircle,
};

export const KanbanCard = ({ 
  card, 
  onDragStart, 
  onDrop 
}: { 
  card: KanbanCardProps; 
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDrop: (id: string, toStatus: string) => void;
}) => {
  const PriorityIcon = PRIORITY_ICONS[card.priority] || CheckCircle2;

  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ 
        scale: 1.05, 
        zIndex: 50, 
        cursor: 'grabbing',
        boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.3)'
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
      layoutId={`card-${card.id}`}
      onDragStart={onDragStart}
      onDrop={(e) => onDrop(e, card.status)}
      className="relative group cursor-grab active:cursor-grabbing"
    >
      <div 
        className={cn(
          'absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center',
          PRIORITY_COLORS[card.priority],
          card.status === 'done' ? 'bg-green-500/20 border-green-500/40' : ''
        )}
      >
        <GripVertical className="w-3 h-3 text-slate-600 dark:text-slate-300" />
      </div>

      <div 
        className={cn(
          'relative rounded-xl border bg-background shadow-sm hover:shadow-md transition-shadow duration-200',
          card.status === 'done' ? 'border-green-500/30 bg-green-50/10 dark:bg-green-950/10' : '',
          'border-border'
        )}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={cn(
              'font-medium text-sm leading-tight line-clamp-2',
              card.status === 'done' ? 'text-green-700 dark:text-green-400' : ''
            )}>
              {card.title}
            </h3>
            
            <div className="flex items-center gap-1">
              <PriorityIcon 
                className={cn(
                  'w-4 h-4',
                  PRIORITY_COLORS[card.priority],
                  card.status === 'done' ? 'text-green-600 dark:text-green-400' : ''
                )}
              />
            </div>
          </div>

          {card.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
              {card.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-wrap gap-1.5">
              {card.tags?.slice(0, 2).map((tag) => (
                <span 
                  key={tag}
                  className={cn(
                    'px-2 py-0.5 text-[10px] rounded-full font-medium',
                    tag === 'bug' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : '',
                    tag === 'feature' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' : '',
                    tag === 'docs' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : '',
                    'border border-border'
                  )}
                >
                  {tag.toUpperCase()}
                </span>
              ))}
              
              {card.tags?.length > 2 && (
                <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-slate-100 dark:bg-slate-800 border border-border">
                  +{card.tags.length - 2}
                </span>
              )}

              {card.dueDate && (
                <div className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border',
                  new Date(card.dueDate) < new Date() ? 
                    'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200' : '',
                  card.status === 'done' ? 'text-green-600 dark:text-green-400 border-green-200/50' : ''
                )}>
                  <Calendar className="w-3 h-3" />
                  {new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}
                </div>
              )}
            </div>

            <button 
              className={cn(
                'opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800',
                card.status === 'done' ? 'text-green-600 dark:text-green-400' : ''
              )}
            >
              <MoreHorizontal className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {card.status !== 'done' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 pt-3 border-t border-dashed border-border"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  card.status === 'todo' ? 'bg-violet-400' : 
                  card.status === 'in-progress' ? 'bg-blue-400' : 
                  card.status === 'review' ? 'bg-amber-400' : ''
                )} />
                <span className="capitalize">{card.status.replace('-', ' ')}</span>
              </div>
            </motion.div>
          )}
        </div>

        {card.status !== 'done' && (
          <div 
            className={cn(
              'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity',
              PRIORITY_COLORS[card.priority]
            )}
          />
        )}
      </div>
    </motion.div>
  );
};

export const KanbanColumn = ({ 
  column, 
  onDrop, 
  onDragStart 
}: KanbanColumnProps) => {
  const [isOver, setIsOver] = React.useState(false);

  return (
    <motion.div
      layoutId={`column-${column.id}`}
      className={cn(
        'flex-1 min-w-[280px] max-w-sm flex flex-col',
        isOver ? 'bg-slate-50/50 dark:bg-slate-900/30 rounded-r-xl' : ''
      )}
    >
      <div 
        className={cn(
          'flex items-center justify-between p-4 border-b',
          column.status === 'done' ? 'border-green-200/50 dark:border-green-900/30 bg-green-50/10 dark:bg-green-950/20 rounded-t-xl' : '',
          isOver ? 'bg-slate-50/80 dark:bg-slate-900/40 border-transparent rounded-r-xl' : ''
        )}
      >
        <div className="flex items-center gap-3">
          <div 
            className={cn(
              'w-2.5 h-2.5 rounded-full',
              column.color,
              isOver ? 'ring-2 ring-slate-400/50' : ''
            )}
          />
          <h3 className="font-medium text-sm">{column.title}</h3>
        </div>

        <span 
          className={cn(
            'text-xs px-2 py-1 rounded-full font-medium border',
            column.status === 'done' ? 'bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200/50' : '',
            isOver ? 'text-slate-600 dark:text-slate-400 border-slate-300/50' : ''
          )}
        >
          {column.cards.length}
        </span>

        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
          <MoreHorizontal className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      <motion.div 
        layout
        className="flex-1 p-3 overflow-y-auto space-y-2 min-h-[100px]"
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsOver(false);
        }}
      >
        <AnimatePresence>
          {column.cards.map((card) => (
            <KanbanCard 
              key={card.id} 
              card={card} 
              onDragStart={onDragStart}
              onDrop={(id, status) => onDrop(id, status)}
            />
          ))}
        </AnimatePresence>

        {column.cards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500',
              isOver ? 'text-violet-400' : ''
            )}
          >
            <div 
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mb-3',
                column.color,
                isOver ? 'ring-2 ring-slate-400/50' : ''
              )}
            >
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Drop items here</span>
          </motion.div>
        )}
      </motion.div>

      {isOver && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-2 right-2"
        >
          <div 
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center',
              column.color,
              isOver ? 'ring-2 ring-slate-400/50' : ''
            )}
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export const KanbanBoard = ({ 
  columns, 
  onCardCreate, 
  onCardDelete, 
  onCardMove 
}: KanbanBoardProps) => {
  const [draggedCardId, setDraggedCardId] = React.useState<string | null>(null);
  const [isAddingCard, setIsAddingCard] = React.useState(false);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('cardId', cardId);
    setDraggedCardId(cardId);
  };

  const handleDrop = (cardId: string, toStatus: string) => {
    if (!onCardMove) return;
    onCardMove(cardId, toStatus);
    setDraggedCardId(null);
  };

  const handleAddCard = () => {
    setIsAddingCard(true);
  };

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex items-center justify-between p-4 border-b',
          columns.some(c => c.status === 'done') ? 'border-green-200/50 dark:border-green-900/30 bg-green-50/10 dark:bg-green-950/20 rounded-t-xl' : '',
          isAddingCard ? 'bg-slate-50/80 dark:bg-slate-900/40 border-transparent rounded-t-xl' : ''
        )}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Kanban Board</h1>
          {columns.some(c => c.status === 'done') && (
            <span 
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium border',
                columns.some(c => c.status === 'done') ? 'bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200/50' : ''
              )}
            >
              {columns.filter(c => c.status === 'done').length} Completed
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className={cn(
            'relative flex items-center rounded-lg border bg-background',
            isAddingCard ? 'border-violet-400 ring-2 ring-violet-500/20' : ''
          )}>
            <Search className="w-4 h-4 text-slate-400 ml-3" />
            <input 
              type="text"
              placeholder="Filter tasks..."
              className={cn(
                'w-48 pl-9 pr-3 py-2 text-sm outline-none bg-transparent',
                isAddingCard ? 'border-violet-400' : ''
              )}
            />
          </div>

          <button 
            onClick={() => setIsAddingCard(!isAddingCard)}
            className={cn(
              'p-2 rounded-lg border transition-colors',
              isAddingCard ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-300' : '',
              'hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
            )}
          >
            <Plus className="w-5 h-5" />
          </button>

          <div 
            className={cn(
              'relative w-9 h-9 rounded-full flex items-center justify-center border transition-colors',
              isAddingCard ? 'bg-violet-500 text-white ring-2 ring-violet-400' : '',
              'border-border hover:border-slate-300'
            )}
          >
            <Plus className="w-4 h-4" />
          </div>
        </div>
      </motion.header>

      {/* Add Card Form */}
      {isAddingCard && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-3 p-4 border-b bg-slate-50/80 dark:bg-slate-900/40"
        >
          <input 
            type="text"
            placeholder="Enter task title..."
            className={cn(
              'flex-1 px-3 py-2 rounded-lg border outline-none transition-colors',
              isAddingCard ? 'border-violet-400 focus:ring-2 ring-violet-500/20' : ''
            )}
          />

          <div className="flex items-center gap-2">
            <button 
              onClick={handleAddCard}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button 
              onClick={() => setIsAddingCard(false)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              Add
            </button>
          </div>
        </motion.div>
      )}

      {/* Columns */}
