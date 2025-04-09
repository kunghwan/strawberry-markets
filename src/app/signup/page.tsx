"use client";

import { useState, useCallback, useTransition, useMemo } from "react";
import { Form, SubmitButton, TextInput } from "../components/ui/Input";
import {
  emailValidator,
  korValidator,
  pwValidator, // ✅ 함수 이름에 맞춰 import
  mobileValidator,
} from "../utils";
import axios from "axios";
import JusoComponent from "./JusoComponent";
import { Loading } from "../components/ui";

// ✅ 전역 타입 (User, DBUser, Juso)은 import 없이 바로 사용 가능!

const initialState: DBUser = {
  addresses: [
    {
      id: "123123",
      roadAddr: "대전광역시 중구 중앙로",
      rest: "501호",
      zipNo: "121",
    },
  ],
  createdAt: new Date(),
  sellerId: null,
  password: "123123",
  email: "test@test.com",
  mobile: "01012341234",
  name: "테스트유저",
  uid: "",
};

const Signup = () => {
  const [props, setProps] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  const [isSearching, setIsSearching] = useState(
    props.addresses.length === 0 ? true : false
  );

  const onChangeP = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProps((prev) => ({ ...prev, [name]: value }));
  }, []);

  const emailMessage = useMemo(
    () => emailValidator(props.email),
    [props.email]
  );
  const pwMessage = useMemo(
    () => pwValidator(props.password),
    [props.password]
  );
  const nameMessage = useMemo(() => korValidator(props.name), [props.name]);
  const mobileMessage = useMemo(
    () => mobileValidator(props.mobile),
    [props.mobile]
  );

  const onSubmit = useCallback(() => {
    if (emailMessage) return alert(emailMessage);
    if (pwMessage) return alert(pwMessage);
    if (nameMessage) return alert(nameMessage);
    if (mobileMessage) return alert(mobileMessage);
    if (props.addresses.length === 0) return alert("배송지를 입력해주세요.");

    startTransition(async () => {
      try {
        const { data } = await axios.post("/api/users", props);
        console.log(data as User);
      } catch (error: any) {
        const message = error.response.data;
        alert(error.message);
      }
    });
  }, [props]);

  return (
    <Form onSubmit={onSubmit} className="p-5 max-w-100 sm:max-w-125 mx-auto">
      {isPending && <Loading fixed divClassName="bg-white/80" />}

      <TextInput
        label="이메일"
        name="email"
        value={props.email}
        onChange={onChangeP}
        message={emailMessage}
      />
      <TextInput
        label="비밀번호"
        name="password"
        type="password"
        value={props.password}
        onChange={onChangeP}
        message={pwMessage}
      />
      <TextInput
        label="이름"
        name="name"
        type="text"
        value={props.name}
        onChange={onChangeP}
        message={nameMessage}
      />
      <TextInput
        label="연락처"
        name="mobile"
        type="text"
        value={props.mobile}
        onChange={onChangeP}
        message={mobileMessage}
      />

      {isSearching && (
        <JusoComponent
          onChangeAddress={(newAddress) => {
            const found = props.addresses.find(
              (item) => item.id === newAddress.id
            );

            if (!found) {
              setProps((prev) => ({ ...prev, addresses: [newAddress] }));
              setIsSearching(false);
            }
          }}
          addresses={props.addresses}
        />
      )}
      {props.addresses.map((addr) => (
        <div
          key={addr.id}
          className="border border-gray-200 p-2.5 rounded flex"
        >
          <div className="flex-1">
            <p>{addr.roadAddr}</p>
            <p>
              {addr.rest} , {addr.zipNo}
            </p>
          </div>
          <button
            className="cursor-pointer text-red-500"
            onClick={() => {
              // 만약 주소에 하나밖에 남지 않았다면 주소를 검색하도록 isSearching => true
              if (props.addresses.length === 1) {
                setIsSearching(true);
              }

              // 주소에서 삭제
              setProps((prev) => ({
                ...prev,
                addresses: prev.addresses.filter((item) => item.id !== addr.id),
              }));
            }}
          >
            삭제
          </button>
        </div>
      ))}

      <SubmitButton>회원가입</SubmitButton>
    </Form>
  );
};

export default Signup;
