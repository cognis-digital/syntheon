"use client";

import { useScroll, useTransform, AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ComponentProps, type ReactNode } from "react";

interface TagData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  featuredImage?: string | null;
}

interface TagPageProps extends ComponentProps<"html"> {
  tags: TagData[];
  layoutId: string;
}

export interface TagPagePropsInterface {
  tags: TagData[];
  layoutId: string;
}

const tagVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
};

const fadeIn = (i: number) => ({
  opacity: 0,
  y: -40,
  scale: 0.98,
  transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
});

const staggerContainer = () => ({
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      duration: 0.6,
      delayChildren: i * 0.15,
      staggerChildren: 0.08,
    },
  }),
});

export default function TagPage({ tags, layoutId }: TagPageProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -60]);
  const scale1 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1.05, 1]
  );

  return (
    <motion.html
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "bg-background",
        color: "text-foreground",
        fontFamily: "var(--font-sans)",
        fontSize: "16px",
        lineHeight: 1.7,
        overflowX: "hidden",
      }}
    >
      <motion.div
        style={{ y: y1, scale: scale1 }}
        className="min-h-screen relative flex flex-col"
      >
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center px-6 md:px-24 lg:px-32">
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto py-20 md:py-32"
          >
            <motion.h1
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
            >
              <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                {tags.length}
              </span>{" "}
              Articles in this topic
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto"
            >
              Explore our curated collection of in-depth articles on{" "}
              <span className="font-semibold">{tags[0]?.name}</span>. Each piece is
              crafted with care and insight.
            </motion.p>

            {tags.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 flex items-center justify-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6, type: "spring" }}
                  className="flex -space-x-2 overflow-hidden"
                >
                  {tags.slice(0, 4).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.1, type: "spring" }}
                      className="w-12 h-12 rounded-full border-2 bg-background"
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.15, 0.25, 0.15],
                  scale: 1 + Math.sin(i * 0.5) * 0.3,
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                className="absolute rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 blur-3xl"
                style={{
                  width: `${40 + i * 10}%`,
                  height: `${40 + i * 10}%`,
                  top: `${20 + i * 8}%`,
                  left: `${15 + i * 6}%`,
                }}
              />
            ))}
          </div>
        </section>

        {/* Tags Grid */}
        <section className="flex-1 px-6 md:px-24 lg:px-32 py-20">
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate="visible"
            custom={0}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1800px] mx-auto"
          >
            {tags.map((tag, i) => (
              <motion.article
                key={tag.id}
                variants={tagVariants}
                custom={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-card rounded-2xl p-6 md:p-8 border border-border/50 hover:border-violet-500/30 transition-colors duration-300 overflow-hidden"
              >
                {/* Hover Glow Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5"
                />

                {/* Featured Image */}
                {tag.featuredImage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.2 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative aspect-video rounded-xl overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={tag.featuredImage}
                      alt={tag.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </motion.div>
                )}

                {/* Content */}
                <h2 className="text-xl md:text-2xl font-semibold mb-3 group-hover:text-violet-400 transition-colors">
                  {tag.name}
                </h2>

                {tag.description && (
                  <p className="text-foreground/60 text-sm mb-4 line-clamp-2">
                    {tag.description}
                  </p>
                )}

                {/* Post Count */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <span className="text-xs text-foreground/50 uppercase tracking-wider font-medium">
                    {tag.postCount.toLocaleString()} articles
                  </span>

                  {/* Animated Counter */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xs text-violet-400 font-mono">
                      {tag.postCount}
                    </span>
                    <span className="text-xs text-foreground/40">items</span>
                  </motion.div>
                </div>

                {/* Hover Action */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-violet-600/80 text-white rounded-2xl font-medium text-sm md:text-base transition-opacity duration-300"
                >
                  Read all articles
                </motion.button>
              </motion.article>
            ))}
          </motion.div>

          {/* Load More / End */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-20 text-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-foreground/40 text-sm"
            >
              Showing {tags.length} of {tags.length} articles in this topic
            </motion.p>
          </motion.div>
        </section>

        {/* Footer CTA */}
        <section className="relative py-24 px-6 md:px-24 lg:px-32 bg-gradient-to-b from-background via-violet-950/10 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Explore related topics
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-foreground/60 mb-8 max-w-xl mx-auto"
            >
              Discover more curated content across our platform. Each topic is carefully selected for quality and depth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
              >
                Browse all topics
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="px-8 py-3 bg-background hover:bg-white/10 text-foreground border border-border rounded-xl font-medium transition-colors"
              >
                Subscribe to newsletter
              </motion.button>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
        </section>
      </motion.div>
    </motion.html>
  );
}
