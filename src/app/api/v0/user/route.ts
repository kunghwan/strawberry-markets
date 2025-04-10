import { dbService, response } from "@/lib";
import { cookies } from "next/headers";

// ✅ GET => 유저 정보 가져오기
export async function GET(req: Request) {
  const authorization = req.headers.get("authorization");
  if (!authorization) {
    return response.error("아이디 토큰을 전달해주세요.");
  }
  const idToken = authorization.split(" ")[1];
  if (!idToken || idToken.length === 0) {
    return response.error("아이디 토큰을 확인해주세요.");
  }

  const uid = new URL(req.url).searchParams.get("uid");
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

// ✅ POST => 로그아웃 처리 (쿠키 삭제)
export async function POST() {
  // 쿠키 삭제는 일반적으로 서버 측에서는 클라이언트에게 빈 쿠키를 재설정하는 방식
  return new Response("Logout success", {
    status: 200,
    headers: {
      "Set-Cookie": `idToken=; Max-Age=0; Path=/; HttpOnly; Secure`,
    },
  });
}

// ✅ PATCH => 유저 정보 수정
export async function PATCH(req: Request) {
  const data = await req.json();

  const auth = req.headers.get("authorization");
  if (!auth) {
    return response.error("no uid");
  }

  const uid = auth.split(" ")[1];
  if (!uid || uid.length === 0) {
    return response.error("no uid");
  }

  const { target, value } = data as { target: keyof User; value: any };

  try {
    await dbService
      .collection("users")
      .doc(uid)
      .update({ [target]: value });
    return response.success<PromiseResult>({ success: true });
  } catch (error: any) {
    return response.error(error.message); // ✅ 오타 수정됨
  }
}
