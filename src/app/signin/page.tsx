"use client";

import { useCallback, useMemo, useState } from "react";
import { Form, Loading, SubmitButton, TextInput } from "../components/ui";
import { emailValidator, pwValidator } from "../utils";
import { AUTH } from "../context";
import { useRouter } from "next/navigation";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailMessage = useMemo(() => {
    return emailValidator(email);
  }, [email]);

  const passwordMessage = useMemo(() => {
    return pwValidator(password);
  }, [password]);

  const { isPending, signin } = AUTH.use();

  const router = useRouter();

  const onSubmit = useCallback(async () => {
    if (emailMessage) {
      return alert(emailMessage);
    }
    if (passwordMessage) {
      return alert(passwordMessage);
    }

    const { success, message } = await signin(email, password);

    if (!success) {
      return alert(message);
    }
    router.push("/", { scroll: true });
  }, [emailMessage, passwordMessage, signin]);

  return (
    <div className="flex flex-col gap-y-2.5 max-w-100 mx-auto">
      {isPending && <Loading fixed divClassName="bg-white/80" />}
      <Form onSubmit={onSubmit}>
        <TextInput
          message={emailMessage}
          label="이메일"
          value={email}
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@naver.com"
        />
        <TextInput
          message={passwordMessage}
          label="비밀번호"
          value={password}
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton>로그인</SubmitButton>
        <SubmitButton
          className="w-full bg-gray-50 "
          onClick={() => router.push("/signup", { scroll: true })}
        >
          회원가입
        </SubmitButton>
      </Form>
    </div>
  );
};

export default SigninPage;
