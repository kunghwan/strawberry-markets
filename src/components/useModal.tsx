"use client";

import { PropsWithChildren, useCallback, useState } from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

const useModal = () => {
  const [state, setState] = useState(false);
  const open = useCallback(() => setState(true), []);
  const hide = useCallback(() => setState(false), []);

  const Modal = useCallback(
    ({ children, state }: PropsWithChildren & { state: boolean }) => {
      return (
        <div
          className={twMerge(
            "fixed top-0 left-0 w-full h-screen z-50 bg-black/30 flex justify-end items-center",
            state ? "visible" : "invisible"
          )}
        >
          <div
            className="bg-white border border-gray-200 border-b-0 h-[90%] w-[calc(100%-40px)] rounded-t-2xl p-5 relative transition duration-300"
            style={{
              transform: `translateY(${state ? "0%" : "100%"})`,
            }}
          >
            {/* 닫기 버튼 */}
            <button
              type="button"
              className="border size-5 p-0 absolute -top-7 right-0 text-white"
              onClick={hide}
            >
              <IoCloseOutline />
            </button>
            {children}
          </div>

          {/* 바깥 영역 클릭 시 닫힘 */}
          <span
            className="absolute -z-10 w-full h-full top-0 left-0"
            onClick={hide}
          />
        </div>
      );
    },
    [hide]
  );

  return {
    Modal,
    open,
    hide,
    state,
  };
};

export default useModal;
