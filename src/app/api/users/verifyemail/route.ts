import dbConnected from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

dbConnected();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = await reqBody;
    console.log("token", token);
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
console.log('user:', user)
    if (!user) {
      return NextResponse.json({ message: "token not found" }, { status: 400 });
    }
    console.log("user-token", user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
