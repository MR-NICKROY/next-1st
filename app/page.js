"use client";
import { useState, useEffect } from "react";
import BlogList from "@/Components/BlogList";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import Preloader from "@/Components/Preloader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const minimumLoadingTime = 4000; // 4 seconds minimum loading time

    const timer = setTimeout(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

      // Ensure we show the preloader for at least 4 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }, minimumLoadingTime);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <main className="min-h-screen">
      <Header />
      <BlogList />
      <Footer />
    </main>
  );
}
