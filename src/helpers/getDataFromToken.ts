import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export default function getDataFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      throw new Error("token not found");
    }

    const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET!);

    return decodedToken.userId

  } catch (error: any) {
    throw new Error(error.message);
  }
}
