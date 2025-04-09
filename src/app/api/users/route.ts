import { NextResponse } from "next/server";
import { authService, firestore } from "@/app/lib/firebase";
import response from "@/app/api"; // 커스텀 응답 객체

export async function POST(req: Request) {
  const { addresses, email, mobile, name, password, sellerId } =
    (await req.json()) as DBUser;

  const newUser: DBUser = {
    addresses,
    email,
    mobile,
    name,
    password,
    sellerId,
    createdAt: new Date(),
    uid: "",
  };

  try {
    // 🔎 이메일 중복 체크
    const snap = await firestore
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!snap.empty) {
      return NextResponse.json(
        { message: "이미 존재하는 회원입니다" },
        { status: 400, statusText: "Already Exists" }
      );
    }

    // 🔐 Firebase Auth 생성
    const res = await authService.createUserWithEmailAndPassword(
      email,
      password
    );
    if (!res.user) throw new Error("사용자 생성 실패");

    const uid = res.user.uid;
    const userRef = firestore.collection("users").doc(uid);

    const user: User = { ...newUser, uid };
    delete (user as any).password; // 비밀번호는 저장하지 않음

    await userRef.set(user);

    return response.success(user);
  } catch (error: any) {
    return response.error(error.message || "서버 오류 발생");
  }
}
