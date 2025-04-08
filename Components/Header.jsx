"use client";
import { assets } from "@/Assets/assets";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with email:", email);

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      console.log("Making POST request to /api/email");

      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      toast.success("Successfully subscribed to our newsletter!");
      setEmail(""); // Clear the input
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      router.push("/admin/subscription");
      setShowAdminModal(false);
      setAdminPassword("");
    } else {
      toast.error("Invalid admin password");
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center">
        <Image
          src={assets.logo}
          width={180}
          alt=""
          className="w-[130px] sm:w-auto"
          priority
        />
        <div className="flex gap-4">
          <button
            onClick={() => setShowAdminModal(true)}
            className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000] cursor-pointer hover:bg-gray-100 transform hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform duration-200 active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
          >
            Admin
            <Image src={assets.arrow} alt="image" />
          </button>
        </div>
      </div>

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 border border-black shadow-[-7px_7px_0px_#000]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Admin Login</h2>
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setAdminPassword("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded outline-none focus:border-black"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminPassword("");
                  }}
                  className="flex items-center gap-2 font-medium py-2 px-4 border border-solid border-black shadow-[-4px_4px_0px_#000] cursor-pointer hover:bg-gray-100 active:shadow-none active:translate-x-[-4px] active:translate-y-[4px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 font-medium py-2 px-4 border border-solid border-black shadow-[-4px_4px_0px_#000] cursor-pointer hover:bg-gray-100 active:shadow-none active:translate-x-[-4px] active:translate-y-[4px] transition-all"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="text-center my-8">
        <h1 className="text-3xl sm:text-5xl font-medium">Latest Blogs</h1>
        <p className="mt-10 max-w-[740px] m-auto text-sm sm:text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. In tempora
          obcaecati, minima perspiciatis officia dicta animi magni molestias
          impedit alias quam praesentium sunt perferendis, et vitae dolorem ad
          odio! Autem?
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex justify-between max-w-[700px] scale-75 sm:scale-100 border border-black mx-auto mt-10 shadow-[-7px_7px_0px_#000] transform hover:translate-y-[-2px] hover:translate-x-[-2px] transition-all duration-200"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-4 outline-none w-full transform transition-all duration-200"
            placeholder="Enter Your Email"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="border-l border-black p-3 sm:p-5 active:bg-gray-600 active:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transform active:translate-y-[2px] active:translate-x-[2px] transition-transform duration-200"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
