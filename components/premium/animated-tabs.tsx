The user wants a premium, animated tabs component with framer-motion, violet design tokens, and proper TypeScript typing. Let me build this carefully:

1. Use `use client` at top since it uses hooks/motion
2. Import framer-motion components
3. Create rich props interface with sensible defaults
4. Implement smooth transitions using motion.div for container and items
5. Add hover effects, active states, and focus rings
6. Gate reduced motion behind prefers-reduced-motion query
7. Use violet semantic tokens from Tailwind
8. Make it accessible (keyboard nav, ARIA)
9. Keep it 60fps with tasteful easing

Let me structure the props:
- items: array of { label, value, icon?, content? }
- activeValue: string | null
- onChange: callback
- orientation: horizontal/vertical
- size: sm/md/lg
- animateOnHover: boolean
- mountAnimation: boolean
- etc.

Motion strategy:
- Container: staggered entrance animation
- Items: smooth layout transitions, hover scale, active state highlight
- Reduced motion: simple opacity fade only
</think>
