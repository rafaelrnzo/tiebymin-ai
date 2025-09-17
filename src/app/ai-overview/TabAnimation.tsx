"use client";

import { AnimatePresence, motion } from "framer-motion";

interface TabAnimationProps {
  activeTab: number;
  children: React.ReactNode;
}

export default function TabAnimation({
  activeTab,
  children,
}: TabAnimationProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeTab}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.3,
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
