"use client";

import {
  useState,
  useCallback,
  ChangeEvent,
  useTransition,
  useMemo,
} from "react";
import { Form, SubmitButton, TextInput } from "../components/ui/Input";
import {
  emailValidator,
  korValidator,
  passwordValidator,
  mobileValidator,
} from "../utils";
import axios from "axios";
import JusoComponent from "./JusoComponent";
import { Loading } from "../components/ui";

// ✅ 전역 타입 (User, DBUser, Juso)은 import 없이 바로 사용 가능!

const initialState: DBUser = {
  addresss: [],
  createdAt: new Date(),
  email: "",
  mobile: "",
  name: "",
  password: "",
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

  const emailMessage = useMemo(
    () => emailValidator(props.email),
    [props.email]
  );
  const nameMessage = useMemo(() => korValidator(props.name), [props.name]);
  const mobileMessage = useMemo(
    () => mobileValidator(props.mobile),
    [props.mobile]
  );
  const passwordMessage = useMemo(
    () => passwordValidator(props.password),
    [props.password]
  );

  const onSubmit = useCallback(() => {
    if (emailMessage) return alert(emailMessage);
    if (passwordMessage) return alert(passwordMessage);
    if (nameMessage) return alert(nameMessage);
    if (mobileMessage) return alert(mobileMessage);
    if (props.addresss.length === 0) return alert("기본 배송지를 추가해주세요");

    startTransition(async () => {
      try {
        const { data } = await axios.post("/api/users", props); // ✅ 실제 API 경로 확인

        console.log("회원가입 성공:", data);
      } catch (error: any) {
        alert(error.message || "회원가입 중 오류가 발생했습니다.");
        console.log(error);
      }
    });
  }, [props, emailMessage, passwordMessage, nameMessage, mobileMessage]);

  return (
    <Form onSubmit={onSubmit} className="p-5 max-w-100 mx-auto">
      {isPending && <Loading fixed divClassName="bg-white/80" />}

      <TextInput
        label="이메일"
        id="email"
        name="email"
        value={props.email}
        onChange={onChangeP}
        message={emailMessage}
      />

      <TextInput
        label="비밀번호"
        id="password"
        name="password"
        type="password"
        value={props.password}
        onChange={onChangeP}
        message={passwordMessage}
      />

      <TextInput
        label="이름"
        id="name"
        name="name"
        value={props.name}
        onChange={onChangeP}
        message={nameMessage}
      />

      <TextInput
        label="연락처"
        id="mobile"
        name="mobile"
        value={props.mobile}
        onChange={onChangeP}
        message={mobileMessage}
      />

      {props.addresss.length === 0 ? (
        <JusoComponent
          onChangeAddress={(newAddr) =>
            setProps((prev) => ({ ...prev, addresss: [newAddr] }))
          }
          addresses={props.addresss}
        />
      ) : (
        <TextInput
          label="기본 배송지"
          name="add"
          readOnly
          value={`${props.addresss[0].roadAddr} ${props.addresss[0].rest}`}
        />
      )}

      <SubmitButton className="mt-2.5">회원가입</SubmitButton>
    </Form>
  );
};

export default Signup;
