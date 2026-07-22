import dbConnected from "@/dbConfig/dbConfig";
import getDataFromToken from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

dbConnected();

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "User found successfully!",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
