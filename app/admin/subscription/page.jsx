"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function SubscriptionPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch emails
  const fetchEmails = async () => {
    try {
      const response = await fetch("/api/email");
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      toast.error("Failed to fetch emails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // Delete email
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/email?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEmails(emails.filter((email) => email._id !== id));
        toast.success("Email deleted successfully");
      } else {
        toast.error("Failed to delete email");
      }
    } catch (error) {
      toast.error("Failed to delete email");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Email Subscriptions
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {emails.map((email) => (
                  <motion.tr
                    key={email._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {email.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(email.date).toLocaleDateString()}
                      </div>
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
                        onClick={() => handleDelete(email._id)}
                        className="text-red-600 hover:text-red-900 transition-all duration-200 cursor-pointer p-2 rounded-lg hover:shadow-lg"
                      >
                        <FaTrash className="w-5 h-5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {emails.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No email subscriptions found</p>
        </motion.div>
      )}
    </div>
  );
}

export default SubscriptionPage;
