"use client";

import { useTextInput } from "@/components";
import { Form } from "@/components/Tags";
import { AUTH } from "@/contexts";
import { emailValidator, passwordValidator } from "@/utils";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

const Signin = () => {
  //! useEffect 등으로 모든 회원의 이메일을 가져오기
  const { user, signin } = AUTH.use();
  const [loginProps, setLoginProps] = useState({
    email: "test@test.com",
    password: "123123",
  });

  const Email = useTextInput();
  const Password = useTextInput();

  const onChangeL = useCallback(
    (value: string, event: ChangeEvent<HTMLInputElement>) => {
      setLoginProps((prev) => ({ ...prev, [event.target.name]: value }));
      // obg['name'] obg,name
    },
    []
  );

  const emailMessage = useMemo(
    () => emailValidator(loginProps.email),
    [loginProps.email]
  );

  const passwordMessage = useMemo(
    () => passwordValidator(loginProps.password),
    [loginProps.password]
  );

  const router = useRouter();

  //! next/navigation (0)  !== netxt/router (X)
  const onSubmit = useCallback(async () => {
    if (emailMessage) {
      alert(emailMessage);
      return Email.focus();
    }
    if (passwordMessage) {
      alert(passwordMessage);
      return Password.focus();
    }

    const { success, message } = await signin(
      loginProps.email,
      loginProps.password
    );

    if (!success || message) {
      return alert(message ?? "문제생김");
    }
    alert("환영합니다");
    router.push("/", { scroll: true });

    console.log({ loginProps });
  }, [emailMessage, passwordMessage, loginProps, Email, Password]);

  if (user) {
    return <h1>유저에게 제한된 페이지입니다.</h1>;
  }

  return (
    <Form
      btnClassName="flex-col h-25 h-[106px]"
      Submit={
        <>
          <button className="primary  p-2">로그인</button>
          <button
            className="bg-gray-100"
            type="button"
            onClick={() => router.push("/signup", { scroll: true })}
          >
            회원가입
          </button>
        </>
      }
    >
      <Email.TextInput
        label="이메일"
        value={loginProps.email}
        onChangeText={onChangeL}
        name="email"
        message={emailMessage}
        placeholder="email@email.com"
      />
      <Password.TextInput
        label="비밀번호"
        value={loginProps.password}
        onChangeText={onChangeL}
        name="password"
        type="password"
        message={passwordMessage}
        placeholder="*****"
        messageClassName="text-gray-900"
      />
    </Form>
  );
};

export default Signin;
