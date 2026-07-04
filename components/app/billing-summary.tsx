'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, Line } from 'recharts';
import { DollarSign, CreditCard, Clock, TrendingUp, ArrowRight, RefreshCw, Download, PlusCircle } from 'lucide-react';

interface BillingSummaryProps {
  balance: number;
  pendingInvoices?: Array<{ id: string; amount: number; dueDate: Date; status: 'pending' | 'overdue' | 'paid' }>;
  recentTransactions?: Array<{ id: string; description: string; amount: number; date: Date; type: 'income' | 'expense' }>;
  paymentMethods?: Array<{ id: string; name: string; isDefault: boolean; lastUsed: Date | null }>;
  isLoading?: boolean;
}

const violetGradient = {
  from: '#8b5cf6',
  to: '#7c3aed',
};

export interface BillingSummaryPropsInterface extends BillingSummaryProps {}

export default function BillingSummary({ 
  balance, 
  pendingInvoices = [], 
  recentTransactions = [], 
  paymentMethods = [],
  isLoading = false 
}: BillingSummaryProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'invoices' | 'methods'>('overview');

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
  };

  // Prepare chart data for last 7 days
  const prepareChartData = () => {
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Calculate net flow for this day
      let dailyFlow = 0;
      
      recentTransactions.filter(t => 
        t.date.toDateString() === date.toDateString()
      ).forEach(t => {
        if (t.type === 'income') {
          dailyFlow += t.amount;
        } else {
          dailyFlow -= t.amount;
        }
      });

      data.push({
        day: i,
        flow: dailyFlow,
        balance: balance - (i * 10), // Simulated trend
      });
    }

    return data.reverse();
  };

  const chartData = prepareChartData();

  // Calculate totals
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = pendingInvoices.filter(inv => inv.status === 'overdue').length;
  
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Main Card */}
      <Card className="border-border/50 bg-background/80 backdrop-blur-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={cn(
                "text-2xl font-semibold tracking-tight",
                "bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent"
              )}>
                Billing Summary
              </CardTitle>
              <CardDescription className="mt-1">
                Track your balance, invoices, and payment methods.
              </CardDescription>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-48">
              <TabsList className="bg-muted/50 border-border rounded-lg h-12">
                <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:text-primary font-medium">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="invoices" className="data-[state=active]:bg-background data-[state=active]:text-primary font-medium">
                  Invoices
                </TabsTrigger>
                <TabsTrigger value="methods" className="data-[state=active]:bg-background data-[state=active]:text-primary font-medium">
                  Methods
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Balance Card */}
              <Card className="border-border/50 bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-white/10 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-5 w-5" />
                      <span className="text-sm font-medium">Current Balance</span>
                    </div>
                    <Badge variant={balance > 0 ? 'default' : 'destructive'} className="bg-violet-600/20 text-violet-300 border-violet-400/30">
                      {isLoading ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        balance > 0 ? 'Available' : 'Negative'
                      )}
                    </Badge>
                  </div>

                  <motion.div
                    key={balance}
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="text-4xl font-bold tracking-tight"
                  >
                    {formatCurrency(balance)}
                  </motion.div>

                  <div className="mt-4 flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-border/50 bg-background/80 hover:bg-primary/10 hover:text-primary transition-colors duration-200 group-hover:scale-105 active:scale-95"
                    >
                      <Download className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary" />
                      Export Statement
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-border/50 bg-background/80 hover:bg-primary/10 hover:text-primary transition-colors duration-200 group-hover:scale-105 active:scale-95"
                    >
                      <PlusCircle className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary" />
                      Add Funds
                    </Button>
                  </div>

                  {/* Mini Chart */}
                  <div className="mt-6 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone"
                          dataKey="balance"
                          stroke="url(#balanceGradient)"
                          fill="url(#balanceGradient)"
                          strokeWidth={2}
                          animationDuration={1000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Invoices */}
              <Card className="border-border/50 bg-background/80 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-5 w-5" />
                      <span className="text-sm font-medium">Pending Invoices</span>
                    </div>
                    <Badge variant={overdueCount > 0 ? 'destructive' : 'default'} className="bg-violet-600/20 text-violet-300 border-violet-400/30">
                      {pendingInvoices.length} items
                    </Badge>
                  </div>

                  <motion.div variants={itemVariants}>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-28 gap-1">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 4, opacity: 0 }}
                            animate={{ 
                              height: [4, 12 + Math.random() * 8, 4], 
                              opacity: 1 
                            }}
                            transition={{ 
                              duration: 0.6, 
                              repeat: Infinity, 
                              delay: i * 0.1,
                              type: 'easeInOut',
                            }}
                            className="w-2 bg-violet-500/40 rounded-full"
                          />
                        ))}
                      </div>
                    ) : pendingInvoices.length === 0 ? (
                      <div className="flex items-center justify-center h-28 text-muted-foreground">
                        <span className="text-sm">No pending invoices</span>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent">
                        {pendingInvoices.slice(0, 5).map((invoice) => (
                          <motion.div
                            key={invoice.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/30 hover:border-violet-500/40 transition-colors duration-200"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">Invoice #{invoice.id.slice(0, 8)}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(invoice.dueDate)} • {invoice.status}</p>
                            </div>
                            <span className={cn(
                              "font-semibold",
                              invoice.status === 'overdue' ? 'text-red-400' : 
                              invoice.status === 'pending' ? 'text-violet-400' : 'text-green-400'
                            )}>
                              {formatCurrency(invoice.amount)}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-3 text-muted-foreground hover:text-primary hover:bg-violet-500/10 border-border/30 group-hover:scale-[1.02] active:scale-95 transition-all duration-200"
                    >
                      View All Invoices <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Invoices Tab Content */}
          {activeTab === 'invoices' && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">All Invoices</h3>
                <Button variant="outline" size="sm" className="border-border/50 bg-background/80 hover:bg-primary/10 hover:text-primary transition-colors duration-200 group-hover:scale-105 active:scale-95">
                  <Download className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary" />
                  Download Report
                </Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-64 gap-1">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 4, opacity: 0 }}
                      animate={{ 
                        height: [4, 20 + Math.random() * 30, 4], 
                        opacity: 1 
                      }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: Infinity, 
                        delay: i * 0.05,
                        type: 'easeInOut',
                      }}
                      className="w-2 bg-violet-500/40 rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-border/50 bg-background/80 backdrop-blur-xl shadow-sm">
                  <CardContent className="p-6">
                    {pendingInvoices.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                        <CreditCard className="h-12 w-12 mb-3 opacity-50" />
                        <p>No invoices found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-border/30">
                              <th className="py-2 px-4 text-sm font-medium text-muted-foreground">Invoice ID</th>
                              <th className="py-2 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                              <th className="py-2 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                              <th className="py-2 px-4 text-sm font-medium text-muted-foreground">Status</th>
                              <th className="py-2 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingInvoices.map((invoice) => (
                              <motion.tr
                                key={invoice.id}
                                variants={itemVariants}
                                whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                                className="border-b border-border/20 last:border-0"
                              >
                                <td className="py-3 px-4">
                                  <span className="font-mono text-sm">{invoice.id}</span>
                                </td>
                                <td className="py-3 px-4 font-medium">
                                  {formatCurrency(invoice.amount)}
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">
                                  {formatDate(invoice.dueDate)}
                                </td>
                                <td className="py-3 px-4">
                                  <Badge variant={invoice.status === 'overdue' ? 'destructive' : invoice.status === 'pending' ? 'default' : 'secondary'} className="bg-violet-600/20 text-violet-300 border-violet-400/30">
                                    {invoice.status}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-violet-500/20 hover:text-primary transition-colors duration-200 group-hover:scale-110 active:scale-95">
                                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                  </Button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Payment Methods Tab Content */}
          {activeTab === 'methods' && (
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h3>

              {isLoading ? (
                <div className="flex items-center justify-center h-64 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 4, opacity: 0 }}
                      animate={{ 
                        height: [4, 28 + Math.random() * 12, 4], 
                        opacity: 1 
                      }}
                      transition={{ 
                        duration: 0.7, 
                        repeat: Infinity, 
                        delay: i * 0.05,
                        type: 'easeInOut',
                      }}
                      className="w-2 bg-violet-500/40 rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-border/50 bg-background/80 backdrop-blur-xl shadow-sm">
                  <CardContent className="p-6">
                    {paymentMethods.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                        <CreditCard className="h-12 w-12 mb-3 opacity-50" />
                        <p>No payment methods added</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4 border-border/50 bg-background/80 hover:bg-primary/10 hover:text-primary transition-colors duration-200 group-hover:scale-105 active:scale-95"
                        >
                          <PlusCircle className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary" />
                          Add Payment Method
                        </Button>
                      </div>
                    ) : (
                      <motion.div variants={itemVariants} className="space-y-3">
                        {paymentMethods.map((method, index) => (
                          <motion.div
                            key={method.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-lg border",
                              method.isDefault 
                                ? "bg-violet-500/10 border-violet-500/40 shadow-sm" 
                                : "bg-muted/30 border-border/20 hover:border-violet-500/30 transition-colors duration-200"
                            )}
                          >
