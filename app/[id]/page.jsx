"use client";
import { assets } from "@/Assets/assets";
import Footer from "@/Components/Footer";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "@/Components/Loader";

const Page = ({ params }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const resolvedParams = React.use(params);

  useEffect(() => {
    fetchBlogData();
  }, [resolvedParams.id]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      // First fetch all blogs
      const URL = process.env.PASSWORD_DELETE_BLOG;
      const response = await fetch(`${URL}/api/blog`);
      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to fetch blog data");
      }

      // Find the blog with matching ID
      const foundBlog = data.blogs.find(
        (blog) => blog._id === resolvedParams.id
      );

      if (!foundBlog) {
        throw new Error("Blog not found");
      }

      setBlog(foundBlog);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Blog not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-200 p-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
          <Link href="/" className="cursor-pointer">
            <Image
              src={assets.logo}
              width={180}
              alt="image"
              className="w-[130px] sm:w-auto"
            />
          </Link>

          <button className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000]">
            Get Started{" "}
            <Image src={assets.arrow} alt="arrow" width={12} height={12} />
          </button>
        </div>
        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {blog.title}
          </h1>
          <div className="flex flex-col items-center mt-6 space-y-2">
            <Image
              className="rounded-full object-cover"
              src={blog.authorImage}
              width={80}
              height={80}
              alt={blog.author}
            />
            <p className="text-lg">{blog.author}</p>
            <p className="text-sm text-gray-600">
              {new Date(blog.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
        <div className="relative w-full h-[400px] mb-8">
          <Image
            className="object-cover rounded-lg shadow-lg"
            src={blog.image}
            fill
            alt={blog.title}
            priority
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <span className="inline-block bg-black text-white px-4 py-1 rounded-full text-sm mb-4">
            {blog.category}
          </span>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <div className="whitespace-pre-wrap">{blog.description}</div>
          </div>
        </div>

        <div className="my-24">
          <p className="text-black font-semibold my-4">
            Share this article on social media
          </p>
          <div className="flex gap-4">
            <Image
              src={assets.facebook_icon}
              alt="Facebook"
              width={50}
              height={50}
            />
            <Image
              src={assets.twitter_icon}
              alt="Twitter"
              width={50}
              height={50}
            />
            <Image
              src={assets.googleplus_icon}
              alt="Google Plus"
              width={50}
              height={50}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
