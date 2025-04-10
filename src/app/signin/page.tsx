"use client";

import { useTextInput } from "@/components";
import { Form } from "@/components/Tags";
import { AUTH } from "@/contexts";
import { emailValidator, passwordValidator } from "@/utils";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

const Signin = () => {
  const { user } = AUTH.use();
  const [loginProps, setLoginProps] = useState({
    email: "test@test.com",
    password: "123123",
  });

  const Email = useTextInput();
  const Password = useTextInput();

  const onChangeL = useCallback(
    (value: string, event: ChangeEvent<HTMLInputElement>) => {
      setLoginProps((prev) => ({ ...prev, [event.target.name]: value }));
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

  const onSubmit = useCallback(() => {
    if (emailMessage) {
      alert(emailMessage);
      return Email.focus();
    }
    if (passwordMessage) {
      alert(passwordMessage);
      return Password.focus();
    }

    console.log({ loginProps });
  }, [emailMessage, passwordMessage, loginProps, Email, Password]);

  useEffect(() => {
    console.log(loginProps, user);
  }, [loginProps, user]);

  if (user) {
    return <h1>유저에게 제한된 페이지입니다.</h1>;
  }

  return (
    <Form
      Submit={
        <button className="primary flex-1 p-2" onSubmit={onSubmit}>
          로그인
        </button>
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
