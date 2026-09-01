import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/emails";

// Helper to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If user exists but is not verified, we can resend OTP here or just return error
      // Let's just return error for simplicity, they can login to trigger a new OTP
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const newUser = await db.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        verificationToken: otp,
        verificationTokenExpiry: expiry,
        isEmailVerified: false,
      },
    });

    // Send the OTP via email
    await sendVerificationEmail(email, otp);

    // We do NOT set the cookie here anymore!
    return NextResponse.json({ 
      success: true, 
      message: "Please check your email for the verification code.",
      requiresVerification: true 
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
