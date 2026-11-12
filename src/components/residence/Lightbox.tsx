"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

interface Props {
  images: { src: string; alt: string; caption: string }[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}

export function Lightbox({ images, index, onClose, onIndex }: Props) {
  const { stop, start } = useSmoothScroll();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    stop();
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex(((index ?? 0) + 1) % images.length);
      if (e.key === "ArrowLeft") onIndex(((index ?? 0) - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      start();
    };
  }, [open, index, images.length, onClose, onIndex, stop, start]);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          className="fixed inset-0 z-[85] flex flex-col bg-[#0e0d0b]/95 text-[#ede6d9] backdrop-blur-sm"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <div className="flex items-center justify-between px-5 py-5 md:px-10">
            <span className="eyebrow tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close gallery" className="flex h-11 w-11 items-center justify-center border border-white/20 transition-colors hover:border-[#cdb27e]">
              <X size={18} strokeWidth={1.25} />
            </button>
          </div>
          <div className="relative flex-1">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={index}
                className="absolute inset-x-5 inset-y-0 md:inset-x-24"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) onIndex((index + 1) % images.length);
                  if (info.offset.x > 80) onIndex((index - 1 + images.length) % images.length);
                }}
              >
                <Image src={images[index].src} alt={images[index].alt} fill sizes="100vw" className="pointer-events-none object-contain" draggable={false} />
              </motion.div>
            </AnimatePresence>
            <button type="button" aria-label="Previous image" onClick={() => onIndex((index - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 md:flex">
              <ChevronLeft size={18} />
            </button>
            <button type="button" aria-label="Next image" onClick={() => onIndex((index + 1) % images.length)} className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 md:flex">
              <ChevronRight size={18} />
            </button>
          </div>
          <p className="px-5 py-6 text-center font-display text-2xl italic md:px-10">{images[index].caption}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
