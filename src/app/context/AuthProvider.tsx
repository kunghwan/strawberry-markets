"use client";

import {
  PropsWithChildren,
  useCallback,
  useState,
  useTransition,
  useEffect,
} from "react";
import { authService } from "../lib";
import { AUTH } from ".";
import axios from "axios";
import { isKorCharacter } from "../utils";
import SplashScreen from "../loading";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false);

  const [user, setUser] = useState(AUTH.initialState.user);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const subscribeUser = authService.onAuthStateChanged(async (fbUser) => {
      if (!fbUser) {
        setUser(null);
      } else {
        console.log(fbUser.uid);
        try {
          const { data } = await axios.get("/api/user", {
            params: {
              uid: fbUser.uid,
            },
          });
          console.log(data);
          if (data) {
            setUser(data);
          }
        } catch (error: any) {
          console.log(error);
          // console.log(error.response.data);
        }
      }
      setTimeout(() => setInitialized(true), 1000);
    });

    subscribeUser;
    return subscribeUser;
  }, []);

  const signout = useCallback(() => {
    authService.signOut();
  }, []);

  const signin = useCallback(
    async (email: string, password: string) =>
      new Promise<PromiseResult>((ok) =>
        startTransition(async () => {
          try {
            const { user } = await authService.signInWithEmailAndPassword(
              email,
              password
            );
            if (!user) {
              return ok({ success: false, message: "로그인에 실패" });
            }

            return ok({ success: true });
          } catch (error: any) {
            if (!isKorCharacter(error.message)) {
              return ok({ success: false, message: error.message });
            }
          }
        })
      ),
    []
  );
  const signup = useCallback(
    async (newUser: DBUser) =>
      new Promise<PromiseResult>((ok) =>
        startTransition(async () => {
          try {
            const { user } = await authService.createUserWithEmailAndPassword(
              newUser.email,
              newUser.password
            );

            if (!user) {
              return ok({ success: false, message: "회원가입에 실패" });
            }

            const body: User = {
              ...newUser,
              uid: user.uid,
              createdAt: new Date(),
            };
            //@ ts-ignore
            delete body.password;
            const { data } = await axios.post("api/user/body", {
              email,
              password,
            });
            setUser(data);
            return ok({ success: true });
          } catch (error: any) {
            if (!isKorCharacter(error.message)) {
              return ok({ success: false, message: error.message });
            }
            return ok({ success: false, message: error.response.data });
          }
        })
      ),
    []
  );

  useEffect(() => {
    console.log({ user });
  }, [user]);

  return (
    <AUTH.context.Provider
      value={{
        initialized,
        signin,
        signout,
        user,
        isPending,
        signup,
      }}
    >
      {initialized ? children : <SplashScreen />}
    </AUTH.context.Provider>
  );
};

export default AuthProvider;
