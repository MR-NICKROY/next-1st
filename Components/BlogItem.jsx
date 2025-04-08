import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function BlogItem({
  id,
  title,
  description,
  image,
  category,
  author,
  authorImage,
  date,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform-gpu perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        rotateY: 5,
        rotateX: 2,
        translateZ: 20,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <Link href={`/${id}`}>
        <motion.div
          initial={{ y: 0 }}
          animate={{
            y: isHovered ? -5 : 0,
            rotateX: isHovered ? 2 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative h-[200px] w-full overflow-hidden">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full"
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
            >
              <span className="text-white text-sm font-medium px-4 py-2 rounded-full border border-white">
                View Details
              </span>
            </motion.div>
          </div>
          <motion.div
            className="p-4"
            animate={{
              y: isHovered ? 0 : 5,
              opacity: isHovered ? 1 : 0.95,
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="flex items-center gap-2 mb-2"
              whileHover={{ x: 5 }}
            >
              <motion.span
                className="bg-black text-white text-xs px-3 py-1 rounded-full"
                whileHover={{ scale: 1.1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                {category}
              </motion.span>
              <motion.span
                className="text-gray-500 text-sm"
                animate={{
                  x: isHovered ? 5 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {new Date(date).toLocaleDateString()}
              </motion.span>
            </motion.div>
            <motion.h3
              className="text-xl font-semibold mb-2 line-clamp-2"
              animate={{
                color: isHovered ? "#000" : "#1a1a1a",
                scale: isHovered ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {title}
            </motion.h3>
            <motion.p
              className="text-gray-600 mb-4 line-clamp-3"
              animate={{
                opacity: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
            >
              {description}
            </motion.p>

            <motion.div
              className="flex items-center gap-3"
              whileHover={{ x: 5 }}
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="relative h-10 w-10 rounded-full overflow-hidden"
                whileHover={{ scale: 1.1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <Image
                  src={authorImage}
                  alt={author}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </motion.div>
              <motion.div
                animate={{
                  x: isHovered ? 5 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-medium">{author}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default BlogItem;
