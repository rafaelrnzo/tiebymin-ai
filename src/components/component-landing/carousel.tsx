"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";

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

const swipeConfidenceThreshold = 1000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

interface ResponsiveCarouselProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  onCardChange?: (currentIndex: number) => void;
}

const ResponsiveCarousel = <T,>({
  data,
  renderItem,
  className = "",
  onCardChange,
}: ResponsiveCarouselProps<T>) => {
  const [[page, direction], setPage] = useState([0, 0]);

  const itemIndex =
    ((page % (data?.length || 1)) + (data?.length || 1)) % (data?.length || 1);

  const onCardChangeRef = React.useRef(onCardChange);
  useEffect(() => {
    onCardChangeRef.current = onCardChange;
  }, [onCardChange]);

  useEffect(() => {
    if (onCardChangeRef.current && data && data.length > 0) {
      onCardChangeRef.current(itemIndex);
    }
  }, [itemIndex, data?.length]);

  if (!data || data.length === 0) {
    return null;
  }

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDotClick = (index: number) => {
    const newDirection = index > itemIndex ? 1 : -1;

    const offset = index - itemIndex;

    if (offset === 0) return;

    setPage([page + offset, newDirection]);
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
            dragElastic={0.7}
            dragMomentum={true}
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

      {/* Indikator Titik - hanya tampil di mobile */}
      {data.length > 1 && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex justify-center items-center space-x-1 pb-4 lg:hidden">
          {data.length <= 7
            ? // Tampilkan semua dots jika <= 7
              data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    itemIndex === i ? "bg-pink-500" : "bg-gray-300"
                  }`}
                />
              ))
            : // Jika > 7, tampilkan dots dengan navigasi
              (() => {
                const maxVisibleDots = 5;
                const halfVisible = Math.floor(maxVisibleDots / 2);
                let start = Math.max(0, itemIndex - halfVisible);
                const end = Math.min(data.length, start + maxVisibleDots);

                // Sesuaikan start jika mendekati akhir
                if (end === data.length) {
                  start = Math.max(0, end - maxVisibleDots);
                }

                const dots = [];

                // Tambahkan dot pertama jika tidak termasuk
                if (start > 0) {
                  dots.push(
                    <button
                      key="first"
                      onClick={() => handleDotClick(0)}
                      className="h-2.5 w-2.5 rounded-full bg-gray-300 transition-colors"
                    />
                  );
                  if (start > 1) {
                    dots.push(
                      <span
                        key="ellipsis-start"
                        className="text-gray-400 text-xs px-1"
                      >
                        ...
                      </span>
                    );
                  }
                }

                // Tambahkan dots di range
                for (let i = start; i < end; i++) {
                  dots.push(
                    <button
                      key={i}
                      onClick={() => handleDotClick(i)}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        itemIndex === i ? "bg-pink-500" : "bg-gray-300"
                      }`}
                    />
                  );
                }

                // Tambahkan dot terakhir jika tidak termasuk
                if (end < data.length) {
                  if (end < data.length - 1) {
                    dots.push(
                      <span
                        key="ellipsis-end"
                        className="text-gray-400 text-xs px-1"
                      >
                        ...
                      </span>
                    );
                  }
                  dots.push(
                    <button
                      key="last"
                      onClick={() => handleDotClick(data.length - 1)}
                      className="h-2.5 w-2.5 rounded-full bg-gray-300 transition-colors"
                    />
                  );
                }

                return dots;
              })()}
        </div>
      )}
    </div>
  );
};

export default ResponsiveCarousel;
