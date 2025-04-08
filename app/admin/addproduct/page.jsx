"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { assets } from "@/Assets/assets";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [authorImageUrl, setAuthorImageUrl] = useState(
    "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    category: "Technology",
    author: "AI Assistant",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "Technology", label: "Technology", icon: "💻" },
    { value: "Startup", label: "Startup", icon: "🚀" },
    { value: "Lifestyle", label: "Lifestyle", icon: "🌟" },
    { value: "Business", label: "Business", icon: "💼" },
    { value: "Health", label: "Health", icon: "❤️" },
    { value: "Education", label: "Education", icon: "📚" },
  ];

  const validateImageUrl = (url) => {
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    return validExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const fetchCategoryImage = (category) => {
    // Static images for each category
    const categoryImages = {
      Technology: [
        "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg",
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg",
        "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
      ],
      Startup: [
        "https://images.pexels.com/photos/7367/startup-photos.jpg",
        "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
        "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg",
      ],
      Lifestyle: [
        "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg",
        "https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg",
        "https://images.pexels.com/photos/1051851/pexels-photo-1051851.jpeg",
      ],
      Business: [
        "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
        "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg",
        "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
      ],
      Health: [
        "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg",
        "https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg",
        "https://images.pexels.com/photos/3823086/pexels-photo-3823086.jpeg",
      ],
      Education: [
        "https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg",
        "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg",
        "https://images.pexels.com/photos/301927/pexels-photo-301927.jpeg",
      ],
    };

    // Get random image for the category
    const images = categoryImages[category];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  // Default author images for each category with multiple options
  const defaultAuthorImages = {
    Technology: [
      "https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg",
      "https://images.pexels.com/photos/8438914/pexels-photo-8438914.jpeg",
      "https://images.pexels.com/photos/8438924/pexels-photo-8438924.jpeg",
      "https://images.pexels.com/photos/8438934/pexels-photo-8438934.jpeg",
    ],
    Startup: [
      "https://images.pexels.com/photos/8438981/pexels-photo-8438981.jpeg",
      "https://images.pexels.com/photos/8438986/pexels-photo-8438986.jpeg",
      "https://images.pexels.com/photos/8438989/pexels-photo-8438989.jpeg",
      "https://images.pexels.com/photos/8438991/pexels-photo-8438991.jpeg",
    ],
    Lifestyle: [
      "https://images.pexels.com/photos/8438938/pexels-photo-8438938.jpeg",
      "https://images.pexels.com/photos/8438940/pexels-photo-8438940.jpeg",
      "https://images.pexels.com/photos/8438943/pexels-photo-8438943.jpeg",
      "https://images.pexels.com/photos/8438945/pexels-photo-8438945.jpeg",
    ],
    Business: [
      "https://images.pexels.com/photos/8438950/pexels-photo-8438950.jpeg",
      "https://images.pexels.com/photos/8438953/pexels-photo-8438953.jpeg",
      "https://images.pexels.com/photos/8438955/pexels-photo-8438955.jpeg",
      "https://images.pexels.com/photos/8438958/pexels-photo-8438958.jpeg",
    ],
    Health: [
      "https://images.pexels.com/photos/8438960/pexels-photo-8438960.jpeg",
      "https://images.pexels.com/photos/8438963/pexels-photo-8438963.jpeg",
      "https://images.pexels.com/photos/8438965/pexels-photo-8438965.jpeg",
      "https://images.pexels.com/photos/8438968/pexels-photo-8438968.jpeg",
    ],
    Education: [
      "https://images.pexels.com/photos/8438970/pexels-photo-8438970.jpeg",
      "https://images.pexels.com/photos/8438973/pexels-photo-8438973.jpeg",
      "https://images.pexels.com/photos/8438975/pexels-photo-8438975.jpeg",
      "https://images.pexels.com/photos/8438978/pexels-photo-8438978.jpeg",
    ],
  };

  // Function to get random author image for category
  const getRandomAuthorImage = (category) => {
    const images = defaultAuthorImages[category];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  // Function to cycle through author images
  const cycleAuthorImage = () => {
    const currentCategory = blogData.category;
    const images = defaultAuthorImages[currentCategory];
    const currentIndex = images.indexOf(authorImageUrl);
    const nextIndex = (currentIndex + 1) % images.length;
    setAuthorImageUrl(images[nextIndex]);
  };

  // Update category selection handler
  const handleCategoryChange = (category) => {
    setBlogData((prev) => ({
      ...prev,
      category: category,
    }));

    // Set new image for the selected category
    const newImageUrl = fetchCategoryImage(category);
    setImageUrl(newImageUrl);

    // Update author image based on category
    setAuthorImageUrl(getRandomAuthorImage(category));
  };

  // Update generateBlogContent
  const generateBlogContent = async (category) => {
    setIsGenerating(true);
    try {
      const templates = {
        Technology: {
          titles: [
            "The Future of Technology: Latest Innovations in 2024",
            "How AI is Revolutionizing the Tech Industry",
            "Top 10 Tech Trends You Need to Know",
            "Digital Transformation: A Complete Guide",
            "Emerging Technologies Shaping Our Future",
          ],
          descriptions: [
            `In this comprehensive guide to ${category}, we explore the latest innovations and breakthroughs that are reshaping our digital landscape. From artificial intelligence to quantum computing, we'll dive deep into the technologies that are defining the future of our industry.

The rapid pace of technological advancement has created unprecedented opportunities and challenges. We'll examine how these changes are affecting businesses, consumers, and society as a whole. Our analysis includes real-world applications, expert insights, and practical implications for professionals in the field.

Whether you're a tech enthusiast, industry professional, or business leader, this article provides valuable insights into the current state of technology and its future trajectory. Join us as we explore the cutting-edge developments that are transforming the way we live and work.`,
          ],
          imageQueries: [
            "futuristic technology",
            "artificial intelligence visualization",
            "modern tech office",
            "digital transformation",
            "innovative technology",
          ],
        },
        Startup: {
          titles: [
            "Essential Guide to Launching Your Startup in 2024",
            "From Idea to Success: The Startup Journey",
            "Startup Funding: A Complete Guide",
            "Building a Successful Startup Team",
            "Innovation and Growth Strategies for Startups",
          ],
          descriptions: [
            `Starting a new business venture is both exciting and challenging. This comprehensive guide to ${category} success covers everything you need to know about launching and growing your startup in today's competitive market.

We'll explore key aspects of startup development, including business planning, funding strategies, team building, and market penetration. Learn from successful entrepreneurs and industry experts about proven methodologies and common pitfalls to avoid.

This guide is packed with practical advice, real-world examples, and actionable strategies that you can implement immediately. Whether you're just starting out or looking to scale your existing startup, these insights will help you navigate the path to success.`,
          ],
          imageQueries: [
            "startup office",
            "team collaboration",
            "business meeting modern",
            "startup success",
            "entrepreneur working",
          ],
        },
        Lifestyle: {
          titles: [
            "Creating a Balanced and Fulfilling Lifestyle",
            "Mindful Living: A Guide to Better Life Choices",
            "Wellness and Personal Growth Strategies",
            "Modern Living: Finding Your Perfect Balance",
            "Lifestyle Design: Creating Your Best Life",
          ],
          descriptions: [
            `Discover the art of balanced living in this comprehensive guide to modern ${category}. We'll explore how to create harmony between work, personal life, and well-being in today's fast-paced world.

Learn practical strategies for improving your daily routines, developing healthy habits, and making conscious choices that align with your personal values and goals. From wellness practices to time management techniques, this guide offers valuable insights for anyone looking to enhance their quality of life.

We'll discuss evidence-based approaches to lifestyle optimization, including stress management, personal development, and creating sustainable daily practices that contribute to long-term happiness and fulfillment.`,
          ],
          imageQueries: [
            "balanced lifestyle",
            "mindful living",
            "wellness lifestyle",
            "healthy living",
            "modern lifestyle",
          ],
        },
        Business: {
          titles: [
            "Business Success Strategies for 2024",
            "Mastering Business Growth and Innovation",
            "The Complete Guide to Business Excellence",
            "Modern Business Management Techniques",
            "Building a Sustainable Business Empire",
          ],
          descriptions: [
            `In today's dynamic business environment, success requires a combination of strategic thinking, innovation, and adaptability. This comprehensive guide explores key aspects of modern ${category} management and growth strategies.

We'll examine proven business methodologies, emerging trends, and best practices that drive organizational success. From operational efficiency to market expansion, learn how successful companies are navigating challenges and capitalizing on opportunities in the current business landscape.

This article provides valuable insights for business leaders, entrepreneurs, and professionals looking to enhance their business acumen and drive sustainable growth in their organizations.`,
          ],
          imageQueries: [
            "modern business",
            "corporate office",
            "business meeting",
            "professional workplace",
            "business growth",
          ],
        },
        Health: {
          titles: [
            "Complete Guide to Modern Health and Wellness",
            "Achieving Optimal Health: A Holistic Approach",
            "Evidence-Based Health Strategies",
            "Transform Your Health and Well-being",
            "The Science of Better Health",
          ],
          descriptions: [
            `Embark on a journey to better ${category} with this comprehensive guide to modern wellness. We'll explore evidence-based approaches to improving your physical, mental, and emotional well-being.

Discover the latest research in health science, practical tips for maintaining a healthy lifestyle, and strategies for long-term wellness. Our expert insights will help you make informed decisions about your health journey and develop sustainable habits for lasting results.

From nutrition and exercise to mental health and preventive care, this guide provides a holistic approach to health optimization that you can implement in your daily life.`,
          ],
          imageQueries: [
            "healthy lifestyle",
            "wellness and health",
            "meditation wellness",
            "fitness health",
            "mental wellbeing",
          ],
        },
        Education: {
          titles: [
            "The Future of Learning and Development",
            "Modern Education: Trends and Innovations",
            "Transforming Education in the Digital Age",
            "Effective Learning Strategies for Success",
            "Educational Excellence: A Complete Guide",
          ],
          descriptions: [
            `Explore the evolving landscape of ${category} in this comprehensive guide to modern learning and development. We'll examine how technology, research, and innovative teaching methods are transforming the way we learn and teach.

From traditional classroom settings to digital learning platforms, discover how education is adapting to meet the needs of today's learners. Learn about effective teaching strategies, learning technologies, and educational best practices that enhance the learning experience.

Whether you're an educator, student, or lifelong learner, this guide provides valuable insights into maximizing learning potential and achieving educational success in the modern world.`,
          ],
          imageQueries: [
            "modern education",
            "e-learning",
            "student learning",
            "education technology",
            "classroom future",
          ],
        },
      };

      // Get templates for the selected category
      const categoryTemplates = templates[category];

      // Randomly select title and description
      const randomIndex = Math.floor(
        Math.random() * categoryTemplates.titles.length
      );
      const randomTitle = categoryTemplates.titles[randomIndex];
      const description = categoryTemplates.descriptions[0];

      // Get a random image for the category
      const newImageUrl = fetchCategoryImage(category);

      // Update local state
      setBlogData((prev) => ({
        ...prev,
        title: randomTitle,
        description: description,
      }));

      setImageUrl(newImageUrl);
      setAuthorImageUrl(getRandomAuthorImage(category));

      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  // Load saved form data on component mount
  useEffect(() => {
    const savedImageUrl = localStorage.getItem("blogImageUrl");
    const savedAuthorImageUrl = localStorage.getItem("authorImageUrl");
    const savedBlogData = localStorage.getItem("blogData");

    if (savedImageUrl) setImageUrl(savedImageUrl);
    if (savedAuthorImageUrl) setAuthorImageUrl(savedAuthorImageUrl);
    if (savedBlogData) setBlogData(JSON.parse(savedBlogData));
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    localStorage.setItem("blogImageUrl", imageUrl);
    localStorage.setItem("authorImageUrl", authorImageUrl);
    localStorage.setItem("blogData", JSON.stringify(blogData));
  }, [imageUrl, authorImageUrl, blogData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate image URLs
      if (!validateImageUrl(imageUrl)) {
        throw new Error(
          "Blog image URL must end with .jpg, .jpeg, .png, or .webp"
        );
      }
      if (!validateImageUrl(authorImageUrl)) {
        throw new Error(
          "Author image URL must end with .jpg, .jpeg, .png, or .webp"
        );
      }

      // Prepare blog data for submission
      const formData = {
        title: blogData.title,
        description: blogData.description,
        category: blogData.category,
        imageUrl: imageUrl,
        author: blogData.author,
        authorImage: authorImageUrl,
        date: Date.now(),
      };

      // Submit to database
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create blog post");
      }

      // Show success message
      toast.success("Blog post created successfully!");

      // Clear form and localStorage
      setImageUrl("");
      setAuthorImageUrl("");
      setBlogData({
        title: "",
        description: "",
        category: "Technology",
        author: "AI Assistant",
      });
      localStorage.removeItem("blogImageUrl");
      localStorage.removeItem("authorImageUrl");
      localStorage.removeItem("blogData");

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error(error.message || "Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Create New Blog Post
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Blog Image Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-xl font-semibold mb-4">Blog Thumbnail</p>
              <div className="flex flex-col items-center">
                <Image
                  src={imageUrl || assets.upload_area}
                  alt="upload area"
                  width={300}
                  height={300}
                  className="w-full h-[200px] object-cover rounded-lg mb-4"
                />
                <input
                  className="w-full border-2 border-gray-200 rounded-md p-3 focus:border-black focus:outline-none"
                  type="url"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter Thumbnail Image URL (.jpg, .jpeg, .png, .webp)"
                  required
                />
              </div>
            </div>

            {/* Blog Details Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-semibold">Blog Details</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => generateBlogContent(blogData.category)}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 
                      ${
                        isGenerating
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-purple-500 hover:bg-purple-600 text-white hover:scale-105"
                      }`}
                  >
                    <span role="img" aria-label="AI" className="text-xl">
                      🤖
                    </span>
                    {isGenerating ? "Generating..." : "AI Write"}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <input
                  className="w-full border-2 border-gray-200 rounded-md p-3 focus:border-black focus:outline-none"
                  type="text"
                  name="title"
                  value={blogData.title}
                  onChange={handleChange}
                  placeholder="Enter Blog Title"
                  required
                />
                <textarea
                  className="w-full border-2 border-gray-200 rounded-md p-3 h-32 focus:border-black focus:outline-none resize-none"
                  name="description"
                  value={blogData.description}
                  onChange={handleChange}
                  placeholder="Enter Blog Description"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Author Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-xl font-semibold mb-4">Author Information</p>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 border-2 border-gray-200 rounded-md p-3 focus:border-black focus:outline-none"
                    type="text"
                    name="author"
                    value={blogData.author}
                    onChange={handleChange}
                    placeholder="Enter Author Name"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setBlogData((prev) => ({
                        ...prev,
                        author: "AI Assistant",
                      }));
                      setAuthorImageUrl(
                        getRandomAuthorImage(blogData.category)
                      );
                    }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200"
                  >
                    🤖 Reset
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <Image
                      src={authorImageUrl || assets.profile_icon}
                      alt="author"
                      width={250}
                      height={250}
                      className="rounded-md mb-4 object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
                      onClick={cycleAuthorImage}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                        Click to change
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <input
                      className="flex-1 border-2 border-gray-200 rounded-md p-3 focus:border-black focus:outline-none"
                      type="url"
                      name="authorImageUrl"
                      value={authorImageUrl}
                      onChange={(e) => setAuthorImageUrl(e.target.value)}
                      placeholder="Enter Author Image URL (.jpg, .jpeg, .png, .webp)"
                      required
                    />
                    <button
                      type="button"
                      onClick={cycleAuthorImage}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200"
                      title="Cycle through AI images"
                    >
                      🔄
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-xl font-semibold mb-4">Blog Category</p>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleCategoryChange(category.value)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm transition-all duration-200 ${
                      blogData.category === category.value
                        ? "bg-black text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }`}
                  >
                    <span>{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`relative px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 overflow-hidden
              ${
                isSubmitting
                  ? "bg-purple-500 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 hover:scale-105"
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={false}
          >
            <motion.div
              className="relative z-10 flex items-center justify-center gap-2 text-white"
              initial={{ opacity: 1 }}
              animate={{
                opacity: isSubmitting ? 1 : 1,
                y: isSubmitting ? 0 : 0,
              }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: 0,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: 0.4,
                      }}
                    />
                    <span className="ml-2">Creating Blog Post</span>
                  </motion.div>
                </>
              ) : (
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Create Blog Post
                </motion.span>
              )}
            </motion.div>
            {isSubmitting && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 background-animate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              />
            )}
          </motion.button>
        </div>
      </form>

      <style jsx>{`
        .background-animate {
          background-size: 400%;
          animation: AnimateBackground 3s ease infinite;
        }

        @keyframes AnimateBackground {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}

export default page;
