import { dbService } from "@/app/lib";
import response from "..";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const authorization = req.headers.get("authorization");
  if (!authorization) {
    return response.error("아이디 토큰을 전달해 주세요");
  }

  const idToken = authorization.split(" ")[1];
  if (!idToken || idToken.length === 0) {
    return response.error("아이디 토큰을 확인해 주세요");
  }

  const cookieStore = await cookies();
  cookieStore.set("idToken", idToken);

  const uid = new URL(req.url).searchParams.get("uid");
  console.log(uid, 6);
  if (!uid) {
    return response.error("유저 아이디를 전달해주세요.");
  }

  try {
    const snap = await dbService.collection("users").doc(uid).get();

    const user = snap.data() as User;
    return response.success(user);
  } catch (error: any) {
    return response.error(error.message);
  }
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("idToken");
}
