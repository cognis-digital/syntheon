'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  User, Bell, Moon, Sun, Shield, Mail, 
  ChevronRight, CheckCircle2, AlertCircle, 
  Loader2, LogOut, Settings as SettingsIcon,
  Menu, X, Sparkles, Zap, Lock
} from 'lucide-react';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailNotifications: boolean;
  twoFactor: boolean;
  bio: string;
  website: string;
  location: string;
}

const DEFAULT_STATE: SettingsState = {
  theme: 'system',
  notifications: true,
  emailNotifications: false,
  twoFactor: true,
  bio: '',
  website: '',
  location: ''
};

export interface SettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  initialData?: Partial<SettingsState>;
}

export default function Settings({ className, initialData = DEFAULT_STATE }: SettingsProps) {
  const [state, setState] = useState<SettingsState>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

  // Detect system theme preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setState(prev => ({ ...prev, theme: 'dark' }));
    } else {
      setState(prev => ({ ...prev, theme: 'light' }));
    }
  }, []);

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [-50, 0]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // Tab variants with staggered entrance
  const tabVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
  };

  return (
    <motion.div
      className={cn(
        "min-h-screen bg-background text-foreground",
        "relative overflow-hidden",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: y1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-background/20 rounded-full blur-[80px]" />
      </motion.div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-primary/5 border border-border">
              <SettingsIcon className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </motion.button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left panel - User info */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-1 space-y-6"
                >
                  {/* Profile card */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Profile Settings</h3>
                        <p className="text-muted-foreground text-sm">Manage your personal information</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                        <textarea
                          id="bio"
                          value={state.bio}
                          onChange={(e) => setState(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="website" className="text-sm font-medium">Website</label>
                        <input
                          type="url"
                          id="website"
                          value={state.website}
                          onChange={(e) => setState(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://example.com"
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-medium">Location</label>
                        <input
                          type="text"
                          id="location"
                          value={state.location}
                          onChange={(e) => setState(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="City, Country"
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                      >
                        Save Profile Changes
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Quick stats */}
                  <motion.div 
                    className="bg-card border border-border rounded-2xl p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="text-sm font-semibold mb-4">Quick Stats</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 rounded-xl bg-background/50 border border-border">
                        <div className="text-2xl font-bold text-primary">127</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                      <div className="p-3 rounded-xl bg-background/50 border border-border">
                        <div className="text-2xl font-bold text-primary">4.9</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                      <div className="p-3 rounded-xl bg-background/50 border border-border">
                        <div className="text-2xl font-bold text-primary">8y</div>
                        <div className="text-xs text-muted-foreground">Experience</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right panel - Form fields */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="lg:col-span-2 space-y-6"
                >
                  {/* Form section */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <User className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          placeholder="John"
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          placeholder="Doe"
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="company" className="text-sm font-medium">Company</label>
                        <input
                          type="text"
                          id="company"
                          placeholder="Your company name"
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="jobTitle" className="text-sm font-medium">Job Title</label>
                        <input
                          type="text"
                          id="jobTitle"
                          placeholder="Software Engineer"
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Save All Changes
                    </motion.button>
                  </motion.div>

                  {/* Additional info section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-card border border-border rounded-2xl p-8 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Additional Information</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Email Verification</p>
                          <p className="text-sm text-muted-foreground">Your email has been verified and is active.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Your 2FA is enabled and up to date.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Password Last Changed</p>
                          <p className="text-sm text-muted-foreground">Changed 42 days ago. Consider updating soon.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-2"
                >
                  <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <Bell className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Notification Preferences</h3>
                    </div>

                    <div className="space-y-4">
                      {[
                        { id: 'notifications', label: 'All Notifications', description: 'Receive push notifications for all activities' },
                        { id: 'emailNotifications', label: 'Email Notifications', description: 'Send email digests and important updates' },
                        { id: 'marketing', label: 'Marketing & Promotions', description: 'Product updates, new features, and special offers' }
                      ].map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ x: 4 }}
                          className="flex items-start gap-4 p-5 rounded-xl bg-background/50 border border-border hover:border-primary/30 transition-all cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/5">
                            {item.id === 'notifications' && <Bell className="w-6 h-6 text-primary" />}
                            {item.id === 'emailNotifications' && <Mail className="w-6 h-6 text-primary" />}
                            {item.id === 'marketing' && <Sparkles className="w-6 h-6 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.label}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className={`w-12 h-7 rounded-full border flex items-center justify-center transition-colors ${
                              state[item.id as keyof SettingsState] 
                                ? 'bg-primary/10 border-primary' 
                                : 'bg-background border-border'
                            }`}
                          >
                            <div className={cn(
                              "w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                              state[item.id as keyof SettingsState] && "translate-x-4"
                            )} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                      Save Notification Preferences
                    </motion.button>
                  </div>
                </motion.div>

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                  >
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold">Security Settings</h3>
                      </div>

                      <div className="space-y-4">
                        <motion.div 
                          whileHover={{ x: 4 }}
                          className="flex items-start gap-4 p-5 rounded-xl bg-background/50 border border-border hover:border-primary/30 transition-all cursor-pointer"
                        >
