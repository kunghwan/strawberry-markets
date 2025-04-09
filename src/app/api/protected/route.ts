// 예: /app/api/protected/route.ts
import { cookies } from "next/headers";
import { adminAuth } from "@/app/lib/firebase-admin";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return new Response("No token", { status: 401 });

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    return new Response(JSON.stringify({ message: "인증 성공", uid }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Invalid token", { status: 401 });
  }
}
