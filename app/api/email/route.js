import { NextResponse } from "next/server";
import ConnectDB from "../../../lib/config/db";
import EmailModel from "../../../lib/models/EmailModel";

// Function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// GET all emails
export async function GET() {
  try {
    await ConnectDB();
    const emails = await EmailModel.find({}).sort({ date: -1 });
    return NextResponse.json(emails);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}

// POST new email - Public endpoint for subscriptions
export async function POST(request) {
  try {
    await ConnectDB();
    const body = await request.json();
    const { email } = body;

    // Check if email is provided
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await EmailModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 400 }
      );
    }

    // Create new subscription with lowercase email
    const newEmail = await EmailModel.create({
      email: email.toLowerCase(),
    });

    return NextResponse.json(
      { message: "Successfully subscribed!", email: newEmail },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}

// DELETE email by ID - Protected endpoint for admin only
export async function DELETE(request) {
  try {
    await ConnectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Email ID is required" },
        { status: 400 }
      );
    }

    const deletedEmail = await EmailModel.findByIdAndDelete(id);

    if (!deletedEmail) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Email deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete email" },
      { status: 500 }
    );
  }
}
