"use client";

import { Form, Loading } from "@/components";
import {
  emailValidator,
  korValidator,
  mobileValidator,
  passwordValidator,
} from "@/utils";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import JusoComponent, { JusoRef } from "./JusoComponent";
import { AUTH } from "@/contexts";
import { useRouter } from "next/navigation"; // ✅ 추가

// 타입
type SignupProps = User & { password: string };

const Signup = () => {
  const jusoRef = useRef<JusoRef>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); // ✅ 라우터 선언

  const [signupProps, setSignupProps] = useState<SignupProps>({
    createdAt: new Date(),
    email: "test@test.com",
    name: "유경환",
    password: "123123",
    uid: "",
    sellerId: null,
    jusoes: [],
    mobile: "01058772136",
  });

  const { email, password, name, mobile, jusoes } = signupProps;
  const [confirmPassword, setConfirmPassword] = useState("");

  const onChangeS = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupProps((prev) => ({ ...prev, [name]: value }));
  }, []);

  const nameMessage = useMemo(() => korValidator(name), [name]);
  const mobileMessage = useMemo(() => mobileValidator(mobile), [mobile]);
  const emailMessage = useMemo(() => emailValidator(email), [email]);
  const passwordMessage = useMemo(
    () => passwordValidator(password),
    [password]
  );
  const confirmPasswordMessage = useMemo(() => {
    if (password !== confirmPassword) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return passwordValidator(confirmPassword);
  }, [password, confirmPassword]);

  const { signup, isPending } = AUTH.use();

  const onSubmit = useCallback(async () => {
    if (nameMessage) {
      alert(nameMessage);
      return nameRef.current?.focus();
    }
    if (mobileMessage) {
      alert(mobileMessage);
      return mobileRef.current?.focus();
    }
    if (emailMessage) {
      alert(emailMessage);
      return emailRef.current?.focus();
    }
    if (passwordMessage) {
      alert(passwordMessage);
      return passwordRef.current?.focus();
    }
    if (confirmPasswordMessage) {
      alert(confirmPasswordMessage);
      return confirmPasswordRef.current?.focus();
    }
    if (jusoes.length === 0) {
      alert("기본 배송지를 입력해주세요.");
      jusoRef.current?.openModal();
      jusoRef.current?.focusKeyword();
      return;
    }

    const { success, message, data } = await signup(signupProps);
    if (!success || message) {
      return alert(message ?? "회원가입시 문제 발생");
    }

    alert("회원가입 축하");
    router.push("/"); // ✅ 페이지 이동
  }, [
    nameMessage,
    mobileMessage,
    emailMessage,
    passwordMessage,
    confirmPasswordMessage,
    jusoes,
    signup,
    signupProps,
    router, // ✅ 의존성에 추가
  ]);

  return (
    <div>
      {isPending && (
        <Loading
          container=" "
          wrap="bg-white p-10 border-gray-200 shadow-xl rounded-2xl"
        />
      )}
      <Form
        onSubmit={onSubmit}
        className="w-full p-5"
        Submit={<button className="primary flex-1">회원가입</button>}
      >
        <input
          ref={nameRef}
          name="name"
          value={name}
          onChange={onChangeS}
          placeholder="예 ) 박보검"
          className="w-full border p-2 mb-2"
        />
        <input
          ref={mobileRef}
          name="mobile"
          value={mobile}
          onChange={onChangeS}
          placeholder="010-1234-5678"
          className="w-full border p-2 mb-2"
        />
        <input
          ref={emailRef}
          name="email"
          value={email}
          onChange={onChangeS}
          placeholder="your@email.com"
          className="w-full border p-2 mb-2"
        />
        <input
          ref={passwordRef}
          name="password"
          value={password}
          onChange={onChangeS}
          placeholder="6~18자리"
          type="password"
          className="w-full border p-2 mb-2"
        />
        <input
          ref={confirmPasswordRef}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="********"
          type="password"
          className="w-full border p-2 mb-2"
        />

        {/* 주소 컴포넌트 */}
        <JusoComponent
          jusoes={jusoes}
          onChangeJ={(juso) =>
            setSignupProps((prev) => ({ ...prev, jusoes: juso }))
          }
          ref={jusoRef}
        />
      </Form>
    </div>
  );
};

export default Signup;
