'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, Plus, Copy, Trash2, Search, X, Check, Clock, AlertCircle,
  ChevronLeft, ChevronRight, Eye, EyeOff, Shield, ShieldAlert,
  Calendar, MoreHorizontal, Download, RefreshCw, Filter
} from 'lucide-react';
import { 
  Button, Card, Input, Badge, Label, Textarea, 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter, DialogDescription, DialogTrigger,
  CardContent, CardHeader, CardTitle, CardDescription,
  CardFooter, Separator, ScrollArea, Tabs, TabsList,
  TabsTrigger, TabsContent, Avatar, AvatarFallback
} from '@/components/ui';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  expiresAt?: Date | null;
  lastUsed: Date | null;
  isActive: boolean;
  metadata: Record<string, unknown>;
}

export interface ApiKeyManagerProps {
  initialKeys?: ApiKey[];
  onKeyCreated?: (key: ApiKey) => void;
  onKeyUpdated?: (key: ApiKey) => void;
  onKeyDeleted?: (id: string) => void;
  onKeyRevoked?: (id: string) => void;
}

interface CreateKeyForm {
  name: string;
  expiresAt: Date | null;
  metadata: Record<string, unknown>;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export default function ApiKeyManager({ 
  initialKeys = [], 
  onKeyCreated, 
  onKeyUpdated, 
  onKeyDeleted,
  onKeyRevoked 
}: ApiKeyManagerProps) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'revoked'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'lastUsed'>('date');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewKey, setViewKey] = useState<ApiKey | null>(null);
  const [showFullKey, setShowFullKey] = useState(false);

  // Form state
  const [form, setForm] = useState<CreateKeyForm>({
    name: '',
    expiresAt: null,
    metadata: {},
  });

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (onKeyCreated) onKeyCreated({ id: generateId(), name: '', key: '', createdAt: new Date(), expiresAt: null, lastUsed: null, isActive: true, metadata: {} });
  }, [isCreateModalOpen]);

  const filteredKeys = useMemo(() => {
    let result = [...keys];
    
    if (filterStatus !== 'all') {
      result = result.filter(k => k.isActive === (filterStatus === 'active'));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(k => 
        k.name.toLowerCase().includes(query) ||
        k.key.slice(0, 8).toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'lastUsed': 
          if (!a.lastUsed && !b.lastUsed) return 0;
          if (!a.lastUsed) return 1;
          if (!b.lastUsed) return -1;
          return b.lastUsed.getTime() - a.lastUsed.getTime();
        default: // date (default)
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return result;
  }, [keys, searchQuery, filterStatus, sortBy]);

  const handleCreateKey = () => {
    if (!form.name.trim()) return;

    const newKey: ApiKey = {
      id: generateId(),
      name: form.name,
      key: Array(32).fill('0').map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      createdAt: new Date(),
      expiresAt: form.expiresAt || null,
      lastUsed: null,
      isActive: true,
      metadata: { ...form.metadata },
    };

    setKeys(prev => [newKey, ...prev]);
    setForm({ name: '', expiresAt: null, metadata: {} });
    setIsCreateModalOpen(false);
    
    if (onKeyCreated) onKeyCreated(newKey);
    showToast('Key created successfully', 'success');
  };

  const handleDeleteKey = async (id: string) => {
    setKeys(prev => prev.filter(k => k.id !== id));
    setSelectedKeyId(null);
    
    if (onKeyDeleted) onKeyDeleted(id);
    showToast('Key deleted', 'success');
  };

  const handleRevokeKey = async (id: string, name: string) => {
    setKeys(prev => prev.map(k => 
      k.id === id ? { ...k, isActive: false } : k
    ));
    
    if (onKeyRevoked) onKeyRevoked(id);
    showToast(`Key "${name}" revoked`, 'success');
  };

  const handleCopyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`, 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    }).format(date);
  };

  const formatRelativeTime = (date: Date | null, now: Date = new Date()) => {
    if (!date) return '—';
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diff < 24) return `${diff}h ago`;
    if (diff < 72) return 'Yesterday';
    return formatDate(date);
  };

  const isExpired = (date: Date | null, now: Date = new Date()) => {
    if (!date) return false;
    return date.getTime() < now.getTime();
  };

  const getExpirationStatus = (key: ApiKey): 'normal' | 'warning' | 'critical' | 'expired' => {
    if (!key.expiresAt) return 'normal';
    
    if (isExpired(key.expiresAt)) return 'expired';
    
    const daysLeft = Math.ceil((key.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 7) return 'critical';
    if (daysLeft <= 30) return 'warning';
    
    return 'normal';
  };

  const selectedKey = keys.find(k => k.id === selectedKeyId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage your application&apos;s authentication keys
              </CardDescription>
            </div>
            
            <Button 
              onClick={() => { setForm({ name: '', expiresAt: null, metadata: {} }); setIsCreateModalOpen(true); }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Key
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters & Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or key..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Button 
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className="gap-1"
              >
                All
              </Button>
              <Button 
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
                className="gap-1"
              >
                Active
              </Button>
              <Button 
                variant={filterStatus === 'revoked' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('revoked')}
                className="gap-1"
              >
                Revoked
              </Button>

              <Separator orientation="vertical" className="mx-2 h-6" />

              {/* Sort */}
              <div className="flex items-center gap-1 text-sm">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Sort:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-background border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="lastUsed">Last Used</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mt-4">
            Showing {filteredKeys.length} of {keys.length} keys
            {(searchQuery || filterStatus !== 'all') && (
              <span className="ml-2">
                &bull; filtered by "{searchQuery || 'status'}"
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Keys List */}
      {filteredKeys.length === 0 ? (
        <Card className="min-h-[200px] flex items-center justify-center">
          <div className="text-center text-muted-foreground space-y-2">
            <Key className="h-12 w-12 mx-auto opacity-50" />
            <p>No API keys found</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => { setForm({ name: '', expiresAt: null, metadata: {} }); setIsCreateModalOpen(true); }}
            >
              Create your first key
            </Button>
          </div>
        </Card>
      ) : (
        <ScrollArea className="rounded-lg border-border bg-background">
          <div className="p-4 space-y-3">
            {filteredKeys.map((key, index) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group relative"
              >
                <Card 
                  className={`cursor-pointer transition-all hover:border-primary/50 ${selectedKeyId === key.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedKeyId(key.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Key info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-md flex items-center justify-center ${key.isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                            {key.isActive ? (
                              <Shield className="h-4 w-4 text-primary" />
                            ) : (
                              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${key.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {key.name || `Key #${keys.filter(k => k.id === key.id).length}`}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-mono truncate max-w-[160px]">{key.key.slice(0, 8)}...</span>
                              {key.lastUsed && (
                                <>
                                  <ChevronLeft className="h-3 w-3" />
                                  <span>{formatRelativeTime(key.lastUsed)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expiration status */}
                        {key.expiresAt && (
                          <div className="flex items-center gap-2 text-xs">
                            {getExpirationStatus(key) === 'expired' ? (
                              <>
                                <Clock className="h-3 w-3 text-red-500" />
                                <span className="text-red-500">Expired</span>
                              </>
                            ) : getExpirationStatus(key) === 'critical' ? (
                              <>
                                <AlertCircle className="h-3 w-3 text-orange-500" />
                                <span className="text-orange-500">Expires in 7 days</span>
                              </>
                            ) : getExpirationStatus(key) === 'warning' ? (
                              <>
                                <Clock className="h-3 w-3 text-yellow-500" />
                                <span className="text-yellow-500">Expires soon</span>
                              </>
                            ) : null}
                          </div>
                        )}

                        {/* Metadata preview */}
                        {Object.keys(key.metadata).length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Metadata: {Object.keys(key.metadata).join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); setSelectedKeyId(key.id); }}
                          className={selectedKeyId === key.id ? 'text-primary' : ''}
                        >
                          {selectedKeyId === key.id ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>

                        <div className="relative group/overflow">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); setSelectedKeyId(key.id); }}
                            className="opacity-0 group-hover/overflow:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>

                          {/* Dropdown menu */}
                          <div className="absolute right-0 top-full mt-2 p-3 bg-background border-border rounded-lg shadow-xl min-w-[180px] opacity-0 group-hover/overflow:opacity-100 transition-opacity pointer-events-none z-50">
                            <div className="space-y-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); setSelectedKeyId(key.id); }}
                                className="w-full justify-start gap-2"
                              >
                                <Eye className="h-3 w-3" />
                                View Details
                              </Button>
                              {!key.isActive && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => { e.stopPropagation(); setSelectedKeyId(key.id); }}
                                  className="w-full justify-start gap-2 text-orange-500 hover:text-orange-600"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  Reactivate
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); handleCopyToClipboard(key.key, key.name); }}
                          className="opacity-0 group-hover:overflow:opacity-100 transition-opacity"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); handleDeleteKey(key.id); }}
                          className="text-red-500 hover:text-red-600 opacity-0 group-hover/overflow:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Status badge */}
                    <Badge 
                      variant={key.isActive ? 'default' : 'secondary'}
                      className="mt-3"
                    >
                      {key.isActive ? 'Active' : 'Revoked'}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Create Key Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Set up a new authentication key for your application.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name" className="text-sm">Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production Server, Mobile App v1.0"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-expires" className="text-sm">Expiration Date (Optional)</Label>
