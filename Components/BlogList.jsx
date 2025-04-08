"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get cached data
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem("blogData");
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Check if cache is less than 5 minutes old
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          return data;
        }
      }
    } catch (error) {
      console.error("Error reading from cache:", error);
    }
    return null;
  };

  // Function to set cache data
  const setCacheData = (data) => {
    try {
      localStorage.setItem(
        "blogData",
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Error writing to cache:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      // Check cache first
      const cachedBlogs = getCachedData();

      if (cachedBlogs) {
        setBlogs(cachedBlogs);
        setIsLoading(false);

        // Make a background request to check for updates
        const response = await fetch("/api/blog");
        const data = await response.json();

        if (
          data.success &&
          JSON.stringify(data.blogs) !== JSON.stringify(cachedBlogs)
        ) {
          setBlogs(data.blogs);
          setCacheData(data.blogs);
        }
      } else {
        // No cache or expired cache, make the request
        const response = await fetch("/api/blog");
        const data = await response.json();

        if (data.success) {
          setBlogs(data.blogs);
          setCacheData(data.blogs);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <Link href={`/${blog._id}`}>
              <div className="relative h-48 w-full">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority={true}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-black text-white px-3 py-1 rounded-full text-sm">
                    {blog.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(blog.date).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.description}
                </p>
                <div className="flex items-center">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden">
                    <Image
                      src={blog.authorImage}
                      alt={blog.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium ml-2">
                    {blog.author}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {blogs.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No blogs found</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BlogList;
