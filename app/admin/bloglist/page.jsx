"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Preloader from "@/Components/Preloader";

function BlogList() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
        // Compare with current state to avoid unnecessary updates
        const areArraysEqual =
          JSON.stringify(cachedBlogs) === JSON.stringify(blogs);
        if (!areArraysEqual) {
          setBlogs(cachedBlogs);
          setLoading(false);
          setIsInitialLoad(false);
        }

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
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        if (!data.success) {
          throw new Error("Failed to fetch blogs");
        }

        setBlogs(data.blogs);
        setCacheData(data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const initiateDelete = (blogId) => {
    setSelectedBlogId(blogId);
    setShowPasswordModal(true);
    setPassword("");
    setError(null);
  };

  const handleDelete = async () => {
    try {
      setDeletingId(selectedBlogId);
      setError(null);

      const response = await fetch(
        `/api/blog/${selectedBlogId}?password=${encodeURIComponent(password)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        setShowToast(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete blog");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to delete blog");
      }

      // Remove the deleted blog from the state and update cache
      const updatedBlogs = blogs.filter((blog) => blog._id !== selectedBlogId);
      setBlogs(updatedBlogs);
      setCacheData(updatedBlogs);

      setShowPasswordModal(false);
      setPassword("");
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError(error.message || "Failed to delete blog. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isInitialLoad) {
    return <Preloader />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${
        showPasswordModal ? "h-screen overflow-hidden" : ""
      }`}
    >
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>You are not authorized to delete blogs</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Blog List</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blog Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {blogs.map((blog) => (
                    <motion.tr
                      key={blog._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <Image
                              src={blog.image}
                              alt={blog.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {blog.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-black text-white">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden">
                            <Image
                              src={blog.authorImage}
                              alt={blog.author}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="ml-2 text-sm text-gray-900">
                            {blog.author}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(blog.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.button
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "#fee2e2",
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => initiateDelete(blog._id)}
                          disabled={deletingId === blog._id}
                          className="text-red-600 hover:text-red-900 transition-all duration-200 cursor-pointer p-2 rounded-lg hover:shadow-lg"
                        >
                          {deletingId === blog._id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {blogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No blogs found</p>
          </motion.div>
        )}
      </div>

      {/* Password Modal - Updated Design */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowPasswordModal(false)}
          />
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 z-50 relative transform transition-all duration-300 scale-100 opacity-100">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Delete Blog Post
              </h2>
              <p className="mt-2 text-gray-600">
                This action cannot be undone. Please enter the admin password to
                confirm.
              </p>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && password.trim()) {
                  handleDelete();
                }
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!password.trim()}
                className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogList;
