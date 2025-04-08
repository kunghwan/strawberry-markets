//! GET => 회원전체

import response from "@/app/api";

//! POST => 회원 추가

export async function POST(req: Request) {
  const { addresss, email, mobile, name, password, sellerId } =
    (await req.json()) as DBUser;

  const snap = await DevBundlerService.collection("users")
    .where("email", "==", email)
    .get();

  const foundUser = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  if (foundUser.length > 0) {
    return Response.json(
      { message: "이미 존재하는 회원입니다" },
      { status: 500, statusText: "Already Exists" }
    );
  }

  const res = await authSerVice.creeateUserWithEmailAndPassword(
    email,
    password
  );
  if (res.user) {
    //@ts-ignore
    try {
      const uid = res.user.uid;
      const userRef = ref.doc(uid);
      const user: User = { ...newUser, uid, createdAt: new Date() };
      delete user.password;

      await userRef.set(user);

      return response.success(user);
    } catch (error: any) {
      return response.error(error.message);
    }
  }
}
