import { dbService } from "@/app/lib";
import response from "..";

export async function GET(req: Request) {
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
