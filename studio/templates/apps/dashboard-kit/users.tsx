'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye,
  Download,
  Filter,
  SortAsc,
  SortDesc,
  Users,
  UserPlus,
  Settings,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer' | 'guest';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastActive: string;
  avatarUrl?: string;
}

interface UserTableProps {
  users: User[];
  selectedIds: Set<string>;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectUser: (id: string, checked: boolean) => void;
  onDeleteSelected: () => void;
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  isLoading?: boolean;
}

const STATUS_COLORS = {
  active: 'bg-green-500/10 text-green-600 border-green-200',
  inactive: 'bg-gray-500/10 text-gray-600 border-gray-200',
  pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  suspended: 'bg-red-500/10 text-red-600 border-red-200',
};

const ROLE_COLORS = {
  admin: 'bg-violet-500/10 text-violet-700 border-violet-200',
  editor: 'bg-blue-500/10 text-blue-600 border-blue-200',
  viewer: 'bg-gray-500/10 text-gray-600 border-gray-200',
  guest: 'bg-slate-500/10 text-slate-600 border-slate-200',
};

export interface UsersPageProps {
  initialUsers?: User[];
}

const defaultUsers: User[] = [
  { id: '1', name: 'Alexandra Chen', email: 'alex.chen@syntheon.com', role: 'admin', status: 'active', lastActive: '2 hours ago' },
  { id: '2', name: 'Marcus Thompson', email: 'marcus.t@syntheon.com', role: 'editor', status: 'active', lastActive: '15 minutes ago' },
  { id: '3', name: 'Sarah Williams', email: 's.williams@syntheon.com', role: 'viewer', status: 'pending', lastActive: '2 days ago' },
  { id: '4', name: 'James Rodriguez', email: 'j.rodriguez@syntheon.com', role: 'editor', status: 'active', lastActive: '1 hour ago' },
  { id: '5', name: 'Emily Foster', email: 'emily.foster@syntheon.com', role: 'admin', status: 'suspended', lastActive: '3 weeks ago' },
];

export default function UsersPage({ initialUsers = [] }: UsersPageProps) {
  const [users, setUsers] = useState<User[]>(initialUsers.length > 0 ? initialUsers : defaultUsers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isLoading, setIsLoading] = useState(false);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    if (initialUsers.length > 0 && initialUsers !== users) {
      setUsers(initialUsers);
    }
  }, [initialUsers]);

  const filteredUsers = useMemo(() => {
    let result = [...users];
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery)
      );
    }

    return result.sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]));
      }
      return String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
    });
  }, [users, searchQuery, sortConfig]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortedKey = sortConfig.key;
  const toggleSort = useCallback(() => {
    setSortConfig(prev => ({
      key: prev.key,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedUsers.map(u => u.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelectUser = useCallback((id: string, checked: boolean) => {
    setSelectedIds(prev => 
      checked ? new Set([...prev, id]) : new Set(prev).has(id) ? new Set(prev).delete(id) : prev
    );
  }, []);

  const handleDeleteSelected = () => {
    setUsers(prev => prev.filter(u => !selectedIds.has(u.id)));
    setSelectedIds(new Set());
  };

  const handleEdit = (user: User) => {
    console.log('Edit user:', user);
  };

  const handleView = (user: User) => {
    console.log('View user:', user);
  };

  return (
    <motion.div 
      style={{ opacity }}
      className="min-h-screen bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-3">
                  <Users className="h-6 w-6" />
                  Users Management
                </CardTitle>
                <CardDescription>
                  Manage your team members, their roles, and access levels.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-background border-border focus-visible:ring-primary/20"
                />
              </div>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {selectedIds.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm text-muted-foreground">
                    {selectedIds.size} selected
                  </span>
                  <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Table */}
            <Card className="bg-card border-border">
              <CardContent className="p-0 overflow-hidden">
                {paginatedUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                    <Users className="h-12 w-12 opacity-50" />
                    <p>No users found</p>
                  </div>
                ) : (
                  <>
                    {/* Table Header */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="p-4 w-12">
                              <Checkbox
                                checked={paginatedUsers.length > 0 && selectedIds.size === paginatedUsers.length}
                                onCheckedChange={(checked) => handleToggleSelectAll(checked as boolean)}
                                aria-label="Select all"
                              />
                            </th>
                            <th className="p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={toggleSort}>
                              <div className="flex items-center gap-2">
                                Name
                                {sortConfig.key === 'name' && (
                                  sortConfig.direction === 'asc' ? 
                                    <SortAsc className="h-4 w-4 text-primary" /> : 
                                    <SortDesc className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Last Active</th>
                            <th className="p-4 w-32 text-right">Actions</th>
                          </tr>
                        </thead>
                      </table>
                    </motion.div>

                    {/* Table Body */}
                    <AnimatePresence mode="popLayout">
                      {paginatedUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            duration: 0.2, 
                            delay: index * 0.05,
                            staggerChildren: 0.03 
                          }}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors group"
                        >
                          <td className="p-4">
                            <Checkbox
                              checked={selectedIds.has(user.id)}
                              onCheckedChange={(checked) => handleToggleSelectUser(user.id, checked as boolean)}
                              aria-label={`Select ${user.name}`}
                            />
                          </td>
                          
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-200 to-violet-500 flex items-center justify-center text-white font-semibold text-sm"
                                style={{
                                  background: `linear-gradient(135deg, hsl(${145 + (user.id.charCodeAt(0) % 40) * 2}, 70%, 80%), hsl(${145 + (user.id.charCodeAt(0) % 40) * 2}, 60%, 50%))`
                                }}
                              >
                                {user.name.charAt(0)}
                              </div>
                              <span className="font-medium text-foreground">{user.name}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="text-muted-foreground truncate max-w-[200px]">
                              {user.email}
                            </span>
                          </td>

                          <td className="p-4">
                            <Badge variant="outline" className={ROLE_COLORS[user.role]}>{user.role}</Badge>
                          </td>

                          <td className="p-4">
                            <Badge variant="outline" className={STATUS_COLORS[user.status]}>{user.status}</Badge>
                          </td>

                          <td className="p-4 text-muted-foreground">{user.lastActive}</td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" onClick={() => handleView(user)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>

                    {/* Empty State */}
                    {paginatedUsers.length === 0 && filteredUsers.length > 0 && (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-muted-foreground">
                          No more users to display
                        </td>
                      </tr>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
                        <span className="text-sm text-muted-foreground">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                          {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{' '}
                          {filteredUsers.length} results
                        </span>

                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                          </Button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                            Math.max(0, currentPage - 2),
                            Math.min(totalPages, currentPage + 2)
                          ).map(page => (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          ))}

                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
            >
              {[
                { label: 'Total Users', value: users.length, icon: Users },
                { label: 'Active', value: users.filter(u => u.status === 'active').length, icon: CheckCircle2 },
                { label: 'Pending Review', value: users.filter(u => u.status === 'pending').length, icon: AlertCircle },
                { label: 'Suspended', value: users.filter(u => u.status === 'suspended').length, icon: X },
              ].map((stat, i) => (
                <Card key={i} className="border-border bg-card/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-semibold text-primary">{stat.value}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-violet-500/30" />
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-12 w-12 rounded-full border-4 border-violet-500/30 border-t-violet-500"
            />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
