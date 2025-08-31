"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 5000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

interface ResponsiveCarouselProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
}

const ResponsiveCarousel = <T,>({
  data,
  renderItem,
  className = "",
}: ResponsiveCarouselProps<T>) => {
  const [[page, direction], setPage] = useState([0, 0]);

  if (!data || data.length === 0) {
    return null;
  }

  const itemIndex = ((page % data.length) + data.length) % data.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDotClick = (index: number) => {
    const newDirection = index > itemIndex ? 1 : -1;
    setPage([index, newDirection]);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="relative w-full overflow-hidden"
        style={{ minHeight: "0px" }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page} // Kunci tetap penting untuk AnimatePresence
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 400, damping: 35, mass: 0.8 },
              opacity: { duration: 0.15 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="w-full flex items-center justify-center min-h-[0px]"
          >
            <div className="w-full flex justify-center items-center h-full">
              {renderItem(data[itemIndex])}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indikator Titik */}
      {data.length > 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-center space-x-2 pb-4">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`h-3 w-3 rounded-full transition-colors ${
                itemIndex === i ? "bg-pink-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponsiveCarousel;
