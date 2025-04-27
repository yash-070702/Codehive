import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useState } from "react";

export function AnimatedListItem({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      layout
      className="mx-auto w-full"
    >
      {children}
    </motion.div>
  );
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 2000, ...props }) => {
    const childrenArray = useMemo(() => React.Children.toArray(children), [children]);
    const [visibleItems, setVisibleItems] = useState(childrenArray.slice(0, 4)); // Show 4 items initially
    const [removingItem, setRemovingItem] = useState(null);

    useEffect(() => {
      const interval = setInterval(() => {
        setRemovingItem(visibleItems[0]); // Mark the first item for removal

        setTimeout(() => {
          setVisibleItems((prev) => {
            const nextIndex = (childrenArray.indexOf(prev[prev.length - 1]) + 1) % childrenArray.length;
            const nextItem = childrenArray[nextIndex];

            return [...prev.slice(1), nextItem]; // Remove first item, add new one at the end
          });

          setRemovingItem(null);
        }, 500); // Sync removal and addition delay
      }, delay);

      return () => clearInterval(interval);
    }, [childrenArray, delay, visibleItems]);

    return (
      <div className={cn("relative flex flex-col items-center gap-4 overflow-hidden", className)} {...props}>
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item) => (
            <AnimatedListItem key={item.key}>{item}</AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";
