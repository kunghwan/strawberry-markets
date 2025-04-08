import { firestore as dbService } from "@/app/lib/firebase";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const snap = await dbService.collection("products").get();

  const items = snap.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return NextResponse.json({ message: "api end point check!", items });
}
