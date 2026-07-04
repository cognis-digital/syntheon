'use client';

import { motion, useScroll, useInView, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowUpRight, Package, Clock, CheckCircle2, AlertCircle, ChevronLeft, MoreHorizontal, Download, Share2, Eye, Calendar, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

interface OrderStatus {
  id: string;
  label: string;
  color: 'success' | 'warning' | 'error' | 'neutral' | 'primary';
}

const STATUS_MAP: Record<string, OrderStatus> = {
  pending: { id: 'pending', label: 'Pending', color: 'warning' },
  processing: { id: 'processing', label: 'Processing', color: 'primary' },
  shipped: { id: 'shipped', label: 'Shipped', color: 'neutral' },
  delivered: { id: 'delivered', label: 'Delivered', color: 'success' },
  cancelled: { id: 'cancelled', label: 'Cancelled', color: 'error' },
  refunded: { id: 'refunded', label: 'Refunded', color: 'warning' },
};

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface OrderData {
  id: string;
  customerName: string;
  email: string;
  status: keyof typeof STATUS_MAP;
  createdAt: Date;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress?: string;
  trackingNumber?: string;
}

interface OrdersPageProps {
  orders: OrderData[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onViewDetails?: (order: OrderData) => void;
}

const STATUS_COLORS: Record<string, string> = {
  success: 'bg-success/10 text-success border-success',
  warning: 'bg-warning/10 text-warning border-warning',
  error: 'bg-error/10 text-error border-error',
  neutral: 'bg-neutral/10 text-neutral border-neutral',
  primary: 'bg-primary/10 text-primary border-primary',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export interface OrdersPageProps extends OrdersPageProps {}

function OrderCard({ order, onViewDetails }: { order: OrderData; onViewDetails?: (order: OrderData) => void }) {
  const status = STATUS_MAP[order.status];
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:border-border/50 hover:bg-background/50 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground mb-1">
                #{order.id.slice(0, 8).toUpperCase()}
              </CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(order.createdAt)}
              </p>
            </div>
            
            <Badge 
              variant="outline" 
              className={cn(
                'h-8 px-3 text-xs',
                STATUS_COLORS[status.color] || STATUS_COLORS.neutral
              )}
            >
              {status.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-foreground">{formatCurrency(order.totalAmount)}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onViewDetails?.(order)}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 rounded-full"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex items-center justify-between text-sm py-1"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium text-foreground">{item.quantity} × {formatCurrency(item.unitPrice)}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              {order.shippingAddress ? (
                <>
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{order.shippingAddress}</span>
                </>
              ) : (
                <Clock className="w-3 h-3" />
              )}
            </p>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                PDF
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                <Share2 className="w-3.5 h-3.5 mr-1.5" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SummaryPanel({ orders }: { orders: OrderData[] }) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="grid grid-cols-3 gap-4"
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-success" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Orders</p>
              <p className="text-2xl font-bold text-warning">{pendingOrders}</p>
            </div>
            <Clock className="w-8 h-8 text-warning" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            </div>
            <Package className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function OrdersPage({ orders, isLoading = false, onRefresh }: OrdersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-6 py-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Orders</h1>
            <p className="text-sm text-muted-foreground">Manage and track all marketplace orders</p>
          </div>
          
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? (
              <span className="animate-spin h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full"></span>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4 mr-1.5" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </motion.header>

      {/* Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="border-b border-border/50 bg-muted/30"
      >
        <div className="flex items-center gap-3 px-6 py-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search orders by ID, customer, or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-border focus:border-primary/50"
            />
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1.5" />
            Filters
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="p-6 max-w-[1200px] mx-auto">
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No orders found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
          </motion.div>
        ) : (
          <>
            {/* Summary Panel */}
            <SummaryPanel orders={orders} />

            {/* Orders Grid */}
            <div className="grid grid-cols-1 gap-4 mt-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.4 + index * 0.05, 
                    duration: 0.3 
                  }}
                >
                  <OrderCard order={order} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + orders.length * 0.05, duration: 0.3 }}
              className="flex items-center justify-between mt-8 pt-6 border-t border-border/50"
            >
              <p className="text-sm text-muted-foreground">
                Showing {orders.length} of {orders.length} orders
              </p>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </main>

      {/* Floating Action Button */}
      {orders.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="fixed bottom-6 right-6 h-12 w-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center cursor-pointer"
        >
          <ArrowUpRight className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}

// Type exports for external usage
export type { OrdersPageProps, OrderData, OrderItem };
