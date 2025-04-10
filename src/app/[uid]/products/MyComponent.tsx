"use client";

import { Form, SubmitButton, TextInput, useModal } from "@/components";
import { AUTH } from "@/contexts";
import { isNum } from "@/utils";
import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { authService } from "@/lib";

const MyComponent = () => {
  const { user } = AUTH.use();

  const Seller = useModal();
  const [id, setId] = useState("");

  const message = useMemo(() => {
    if (id.length === 0) return "사업자 등록번호 입력";
    if (id.length !== 10) return "사업자 등록번호 더 입력";
    if (!isNum(id)) return "숫자만 입력";
    return null;
  }, [id]);

  const onUpdate = useCallback(
    async (target: keyof User, value: any) => {
      try {
        const idToken = await authService.currentUser?.getIdToken(); // ✅ 여기 수정됨
        const uid = authService.currentUser?.uid;
        if (!idToken || !user?.uid) {
          return { success: false, message: "인증이 필요합니다." };
        }

        const { data } = await axios.patch(
          "/api/v0/user",
          { target, value },
          {
            headers: {
              Authorization: `Bearer ${user.uid}`, // API에서 uid 기대
            },
          }
        );

        return data;
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    },
    [user]
  );

  const onSubmit = useCallback(async () => {
    if (message) {
      alert(message);
      return;
    }

    const { success, message: msg } = await onUpdate("sellerId", id);
    if (!success || msg) {
      alert(msg);
      return;
    }

    Seller.hide();
    alert("판매자 계정으로 등록되었습니다");
  }, [message, id, onUpdate, Seller]);

  if (!user) return null;

  return (
    <div>
      {!user.sellerId ? (
        <>
          <div className="flex flex-col gap-y-5 p-5">
            <h1>판매자 계정이 아닙니다. 사업자등록번호를 등록해주세요.</h1>
            <SubmitButton className="px-2.5" onClick={Seller.open}>
              사업자 등록번호 입력
            </SubmitButton>
          </div>
          <Form onSubmit={onSubmit}>
            <Seller.Modal className=" absolute top-40  p-5  flex flex-col gap-y-5 ">
              <TextInput
                value={id}
                onChange={(e) => setId(e.target.value)}
                label="사업자 등록번호"
                name="sellerId"
                placeholder="0000000000"
                message={message}
              />
              <SubmitButton onClick={onSubmit}>
                사업자 등록번호 저장
              </SubmitButton>
            </Seller.Modal>
          </Form>
        </>
      ) : null}
    </div>
  );
};

export default MyComponent;
