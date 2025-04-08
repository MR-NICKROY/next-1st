import ConnectDB from "@/lib/config/db";
import BlogModel from "@/lib/models/blogModel";
import { NextResponse } from "next/server";

// GET request handler to fetch all blogs
export async function GET() {
  try {
    await ConnectDB();
    const blogs = await BlogModel.find({})
      .sort({ date: -1 }) // Sort by date in descending order (newest first)
      .select("-__v"); // Exclude the version field

    return NextResponse.json(
      {
        success: true,
        count: blogs.length,
        blogs,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blogs",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// DELETE request handler to delete a blog by ID
export async function DELETE(request) {
  try {
    await ConnectDB();

    // Get the ID from the URL
    const id = request.url.split("/").pop().split("?")[0];

    // Get the password from query parameters
    const url = new URL(request.url);
    const password = url.searchParams.get("password");

    // Check if password matches the environment variable
    const correctPassword = process.env.PASSWORD_DELETE_BLOG || "admin123"; // Default password for development
    if (password !== correctPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog ID is required",
        },
        { status: 400 }
      );
    }

    // Find and delete the blog
    const deletedBlog = await BlogModel.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Blog deleted successfully",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete blog",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function POST(request) {
  try {
    // Initialize database connection
    await ConnectDB();

    const data = await request.json();
    const {
      title,
      description,
      category,
      author,
      imageUrl,
      authorImage,
      date,
    } = data;

    // Validate required fields
    const requiredFields = {
      title: "Title is required",
      description: "Description is required",
      category: "Category is required",
      author: "Author name is required",
      imageUrl: "Post image URL is required",
      authorImage: "Author image URL is required",
      date: "Date is required",
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!data[field]) {
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    // Validate URLs
    const urlFields = { imageUrl, authorImage };
    for (const [field, url] of Object.entries(urlFields)) {
      try {
        new URL(url);
      } catch (e) {
        return NextResponse.json(
          { error: `Invalid URL format for ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate if URLs point to images
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    for (const [field, url] of Object.entries(urlFields)) {
      const hasValidExtension = validExtensions.some((ext) =>
        url.toLowerCase().endsWith(ext)
      );
      if (!hasValidExtension) {
        return NextResponse.json(
          { error: `URL must point to an image file for ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate text lengths
    if (title.length < 5 || title.length > 100) {
      return NextResponse.json(
        { error: "Title must be between 5 and 100 characters" },
        { status: 400 }
      );
    }

    if (description.length < 50 || description.length > 5000) {
      return NextResponse.json(
        { error: "Description must be between 50 and 5000 characters" },
        { status: 400 }
      );
    }

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Create blog post in database
    try {
      const newBlog = await BlogModel.create({
        title,
        description,
        category,
        author,
        image: imageUrl,
        authorImage,
        date: dateObj,
      });

      return NextResponse.json({
        success: true,
        message: "Blog post created successfully",
        blog: newBlog,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save blog post to database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing blog data:", error);
    return NextResponse.json(
      { error: "Failed to process blog data" },
      { status: 500 }
    );
  }
}
