import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/connection";
import { comparePassword, getToken } from "@/lib/utils";
import UsersModel from "@/models/UserModel";

// POST: Login User
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await UsersModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found.", success: false },
        { status: 400 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Password is incorrect.", success: false },
        { status: 400 }
      );
    }

    const token = getToken({
      _id: user._id,
      email: user.email,
      role: user.role ?? "user", // fallback role
    });

    return NextResponse.json(
      {
        message: "Login successful.",
        success: true,
        token,
        data: {
          email: user.email,
          username: user.username || user.email.split('@')[0],
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/login error:", error);
    return NextResponse.json(
      { message: "Login failed", success: false },
      { status: 400 }
    );
  }
}
