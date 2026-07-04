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
