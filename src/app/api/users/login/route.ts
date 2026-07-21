import dbConnected from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConnected();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = await reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "invalid credentials" },
        { status: 400 },
      );
    }
    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return NextResponse.json(
        { message: "invalid credentials" },
        { status: 400 },
      );
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "logged in successfully!",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
