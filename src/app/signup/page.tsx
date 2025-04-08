"use client";

import { useState, useCallback, ChangeEvent, useTransition } from "react";
import { Form, SubmitButton, TextInput } from "../components/ui/Input";

type DBUser = {
  addresss: string[];
  createdAt: Date;
  email: string;
  mobile: string;
  name: string;
  password: string;
  sellerId: string | null;
  uid: string;
};

const initialState: DBUser = {
  addresss: ["대전 중구"],
  createdAt: new Date(),
  email: "test@test.com",
  mobile: "01058772136",
  name: "테스트유저1",
  password: "123123",
  sellerId: null,
  uid: "",
};

const Signup = () => {
  const [props, setProps] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  const onChangeP = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProps((prev) => ({ ...prev, [name]: value }));
  }, []);

  const onSubmit = useCallback(() => {
    console.log(props);
  }, [props]);

  return (
    <Form onSubmit={onSubmit}>
      <TextInput
        label="이메일"
        id="email"
        name="email"
        value={props.email}
        onChange={onChangeP}
      />

      <TextInput
        label="비밀번호"
        id="password"
        name="password"
        value={props.password}
        onChange={onChangeP}
      />

      <TextInput
        label="이름"
        id="name"
        name="name"
        value={props.name}
        onChange={onChangeP}
      />

      <TextInput
        label="연략처"
        id="mobile"
        name="mobile"
        value={props.mobile}
        onChange={onChangeP}
      />

      <p>주소</p>

      <SubmitButton>회원가입</SubmitButton>
    </Form>
  );
};

export default Signup;
