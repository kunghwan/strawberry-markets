"use client";

import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
  useTransition,
  useEffect,
} from "react";
import { AUTH } from "../react.context";
import { authService, dbService, FBCollection } from "@/lib";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(AUTH.initialState.user);
  const [isPending, startTransition] = useTransition();

  const ref = useMemo(() => dbService.collection(FBCollection.USERS), []);

  // ✅ 로그인
  const signin = useCallback(
    (email: string, password: string) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            const { user } = await authService.signInWithEmailAndPassword(
              email,
              password
            );
            if (!user) {
              return resolve({
                success: false,
                message: "알 수 없는 이유로 로그인 실패했습니다.",
              });
            }

            const snap = await ref.doc(user.uid).get();
            const data = snap.data() as User;

            if (!data) {
              return resolve({
                message: "존재하지 않는 유저입니다. 다시 회원가입 해주세요.",
              });
            }

            setUser(data);
            resolve({ success: true });
          } catch (error: any) {
            resolve({ success: false, message: error.message });
          }
        })
      ),
    [ref]
  );

  // ✅ 로그아웃
  const signout = useCallback(
    () =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            await authService.signOut();
            setUser(null);
            resolve({ success: true });
          } catch (error: any) {
            resolve({ message: error.message });
          }
        })
      ),
    []
  );

  // ✅ 회원가입
  const signup = useCallback(
    (newUser: User & { password: string }) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            const { user } = await authService.createUserWithEmailAndPassword(
              newUser.email,
              newUser.password
            );

            if (!user) {
              return resolve({ message: "회원가입에 실패했습니다." });
            }

            // Firebase 인증 성공 → DB 저장
            const storedUser: User = {
              ...newUser,
              uid: user.uid,
              createdAt: new Date(),
            };

            // @ts-ignore
            delete storedUser.password;

            await ref.doc(user.uid || storedUser.uid).set(storedUser);
            setUser(storedUser);

            resolve({ success: true });
          } catch (error: any) {
            resolve({ message: error.message });
          }
        })
      ),
    [ref]
  );

  useEffect(() => {
    setInitialized(true);
  }, []);
  const updateAll = useCallback(
    (updateUser: User) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            //! 유저의 모든 내용을 업데이트 시킴 => set/update
            await ref.doc(updateUser.uid).set(updateUser);
            await ref.doc(updateUser.uid).update(updateUser);
            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    [ref]
  );

  const updateOne = useCallback(
    (target: keyof User, value: any) =>
      new Promise<Result>((resolve) =>
        startTransition(async () => {
          try {
            if (!user) {
              return resolve({
                message:
                  "로그인 한 유저만 사용할 수 있는 기능입니다. 회원가입하시겠습니까?",
              });
            }
            await ref.doc(user.uid).update({ [target]: value });
            return resolve({ success: true });
          } catch (error: any) {
            return resolve({ message: error.message });
          }
        })
      ),
    [ref]
  );

  return (
    <AUTH.Context.Provider
      value={{
        user,
        initialized,
        isPending,
        signin,
        signout,
        signup,
        updateOne,
        updateAll,
      }}
    >
      {children}
    </AUTH.Context.Provider>
  );
};

export default AuthProvider;
