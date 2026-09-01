import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sendVerificationEmail } from "@/lib/emails";

// Helper to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!user.isEmailVerified && !user.isAdmin) {
      const otp = generateOTP();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      
      await db.user.update({
        where: { id: user.id },
        data: {
          verificationToken: otp,
          verificationTokenExpiry: expiry,
        },
      });

      await sendVerificationEmail(email, otp);

      return NextResponse.json({ 
        success: false, 
        error: "EMAIL_NOT_VERIFIED", 
        message: "Please verify your email",
        requiresVerification: true 
      }, { status: 403 });
    }

    const cookieStore = await cookies();
    cookieStore.set("user_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
  }
}
