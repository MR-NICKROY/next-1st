import ConnectDB from "@/lib/config/db";
import BlogModel from "@/lib/models/blogModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(request, { params }) {
  try {
    await ConnectDB();

    const { id } = params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid blog ID format",
        },
        { status: 400 }
      );
    }

    // Get the password from query parameters
    const url = new URL(request.url);
    const password = url.searchParams.get("password");

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error: "Password is required",
        },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete blog",
      },
      { status: 500 }
    );
  }
}
