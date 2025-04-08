"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

const Preloader = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      >
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1, 1, 0.5],
              opacity: [0, 1, 1, 0],
              rotate: [0, 0, 360, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <FaBookOpen className="w-20 h-20 text-blue-500" />
            <motion.div
              className="absolute inset-0 border-4 border-blue-500 rounded-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.5, 1.5, 0.8],
                opacity: [0, 1, 0.5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 text-2xl font-semibold text-gray-700"
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading
            </motion.span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              .
            </motion.span>
          </motion.div>

          <motion.div
            className="mt-6 w-48 h-2 bg-gray-200 rounded-full overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: "0%" }}
              animate={{
                width: ["0%", "100%"],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Preloader;
