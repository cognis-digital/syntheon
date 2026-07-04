'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, Mail, Phone, CheckCircle2, XCircle, Loader2, ChevronLeft, ChevronRight, MoreHorizontal, Filter, ArrowUpDown, UserPlus, Copy, AlertCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'inactive' | 'suspended';
  avatarUrl?: string;
  joinedDate: Date;
  lastActive: Date;
}

interface TeamMembersManagerProps {
  initialData?: TeamMember[];
  onInvite?: (email: string) => Promise<void>;
  onDelete?: (id: string, name: string) => Promise<void>;
  onUpdateRole?: (id: string, role: TeamMember['role']) => Promise<void>;
}

const ROLES: { value: TeamMember['role']; label: string; color: 'violet' | 'indigo' | 'slate' }[] = [
  { value: 'admin', label: 'Administrator', color: 'violet' },
  { value: 'manager', label: 'Manager', color: 'indigo' },
  { value: 'member', label: 'Member', color: 'slate' },
  { value: 'viewer', label: 'Viewer', color: 'slate' },
];

const STATUSES: { value: TeamMember['status']; label: string; icon: React.ReactNode }[] = [
  { value: 'active', label: 'Active', icon: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> },
  { value: 'pending', label: 'Pending', icon: <Loader2 className="h-3.5 w-3.5 text-yellow-500 animate-spin-slow" /> },
  { value: 'inactive', label: 'Inactive', icon: <XCircle className="h-3.5 w-3.5 text-gray-400" /> },
  { value: 'suspended', label: 'Suspended', icon: <XCircle className="h-3.5 w-3.5 text-red-500" /> },
];

const DEFAULT_DATA: TeamMember[] = [
  { id: '1', name: 'Sarah Mitchell', email: 'sarah.mitchell@syntheon.com', role: 'admin', status: 'active', joinedDate: new Date('2024-01-15'), lastActive: new Date() },
  { id: '2', name: 'James Chen', email: 'james.chen@syntheon.com', role: 'manager', status: 'active', joinedDate: new Date('2024-02-03'), lastActive: new Date(Date.now() - 86400000) },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.r@syntheon.com', role: 'member', status: 'pending', joinedDate: new Date('2024-11-20'), lastActive: new Date() },
];

export interface TeamMembersManagerProps {
  initialData?: TeamMember[];
  onInvite?: (email: string) => Promise<void>;
  onDelete?: (id: string, name: string) => Promise<void>;
  onUpdateRole?: (id: string, role: TeamMember['role']) => Promise<void>;
}

export default function TeamMembersManager({ initialData = DEFAULT_DATA, onInvite, onDelete, onUpdateRole }: TeamMembersManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TeamMember['status'] | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<TeamMember['role'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'joinedDate' | 'lastActive'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const ITEMS_PER_PAGE = 8;

  const filteredData = useMemo(() => {
    let result = [...initialData];

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(lowerQ) ||
        m.email.toLowerCase().includes(lowerQ)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      result = result.filter(m => m.role === roleFilter);
    }

    result.sort((a, b) => {
      let aVal: string;
      let bVal: string;

      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'joinedDate':
          aVal = a.joinedDate.toISOString();
          bVal = b.joinedDate.toISOString();
          break;
        case 'lastActive':
          aVal = a.lastActive.toISOString();
          bVal = b.lastActive.toISOString();
          break;
      }

      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return result;
  }, [initialData, searchQuery, statusFilter, roleFilter, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(m => m.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleInvite = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      if (onInvite) await onInvite(email);
    } finally {
      setIsLoading(false);
    }
  }, [onInvite]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from the team?`)) return;
    setIsLoading(true);
    try {
      if (onDelete) await onDelete(id, name);
    } finally {
      setIsLoading(false);
    }
  }, [onDelete]);

  const handleRoleChange = useCallback(async (id: string, role: TeamMember['role']) => {
    setIsLoading(true);
    try {
      if (onUpdateRole) await onUpdateRole(id, role);
    } finally {
      setIsLoading(false);
    }
  }, [onUpdateRole]);

  const getSelectedCount = () => selectedIds.size;

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
      >
        <div>
          <h2 className="text-xl font-semibold text-foreground">Team Members</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your team access and permissions
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex gap-3"
        >
          {getSelectedCount() > 0 && (
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-4 py-2 text-sm rounded-md bg-muted/50 hover:bg-muted transition-colors flex items-center gap-2 text-foreground"
            >
              <XCircle className="h-4 w-4" />
              Deselect All ({getSelectedCount()})
            </button>
          )}

          {getSelectedCount() > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-sm rounded-md bg-destructive/10 hover:bg-destructive/20 transition-colors flex items-center gap-2 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </motion.button>
          )}

          <button
                onClick={() => handleInvite('')}
                disabled={isLoading}
                className="px-4 py-2 text-sm rounded-md bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Inviting...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Invite Member
                  </>
                )}
              </button>
        </motion.div>
      </motion.div>

      {/* Filters bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex gap-3">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="all">All Status</option>
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as any);
              setPage(1);
            }}
            className="px-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="all">All Roles</option>
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          {/* Sort */}
          <div className="relative min-w-[160px]">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [newSort, newDir] = e.target.value.split('-') as ['name' | 'joinedDate' | 'lastActive', 'asc' | 'desc'];
                setSortBy(newSort);
                setSortDirection(newDir);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="joinedDate-asc">Joined (Newest First)</option>
              <option value="joinedDate-desc">Joined (Oldest First)</option>
            </select>
          </div>

          {/* Clear filters */}
          {(searchQuery || statusFilter !== 'all' || roleFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setRoleFilter('all');
                setPage(1);
              }}
              className="px-4 py-2 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Members list */}
      <motion.div
        layout
        className="space-y-3"
      >
        {paginatedData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-muted-foreground"
          >
            <UserPlus className="h-16 w-16 mb-4 opacity-30" />
            <p>No team members found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-primary hover:underline"
              >
                Clear search to see all members
              </button>
            )}
          </motion.div>
        ) : (
          paginatedData.map((member, index) => {
            const isSelected = selectedIds.has(member.id);

            return (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.05,
                  ease: 'easeOut'
                }}
                whileHover={{ scale: 1.01 }}
                className={`relative group rounded-xl border bg-background hover:border-primary/30 transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : ''}`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Checkbox */}
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSelectOne(member.id)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-border hover:border-primary/50'}`}
                  >
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </motion.div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Name and role */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{member.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary ${member.status === 'active' ? '' : member.status === 'pending' ? 'animate-pulse-slow' : ''}`}>
                      {STATUSES.find(s => s.value === member.status)?.icon}
                      <span className={member.status === 'active' ? '' : member.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : ''}>{STATUSES.find(s => s.value === member.status)?.label}</span>
                    </span>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRoleChange(member.id, 'admin')}
                      className="p-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-primary transition-colors"
                      title="Make Admin"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleRoleChange(member.id, 'member')}
                      className="p-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-primary transition-colors"
                      title="Make Member"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => {}}
                      className="p-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-primary transition-colors"
                      title="More Actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Footer with email */}
                <div className="px-4 py-3 border-t bg-muted/20 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground truncate max-w-[280px]">{member.email}</span>
                  <button
                    onClick={() => {}}
                    className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground transition-colors"
                    title="Copy Email"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-background">
            <span className="text-sm text-muted-foreground">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} members
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-md bg-muted/50 hover:bg-muted disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && page > 3) {
                  pageNum = page - 2 + i;
                  if (pageNum > totalPages) pageNum = i + 1;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${page === pageNum ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
