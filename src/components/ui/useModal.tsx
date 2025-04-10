"use client";

import { PropsWithChildren, useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

const useModal = () => {
  const [showing, setShowing] = useState(false);

  const open = useCallback(() => setShowing(true), []);
  const hide = useCallback(() => setShowing(false), []);

  const Modal = ({
    children,
    className,
    shadowClassName,
    containerClassName,
  }: PropsWithChildren<{
    className?: string;
    shadowClassName?: string;
    containerClassName?: string;
  }>) => {
    return !showing ? null : (
      <div
        className={twMerge(
          "fixed top-0 left-0 w-full h-screen flex items-center justify-center z-50",
          !showing && "hidden",
          containerClassName
        )}
      >
        <div
          className={twMerge(
            "bg-white rounded-2xl p-4 duration-300 mt-5 ease-in-out relative z-10",
            showing && "mt-0",
            className
          )}
        >
          {children}
        </div>
        <span
          onClick={hide}
          className={twMerge(
            "absolute top-0 left-0 w-full h-full bg-black/3",
            shadowClassName
          )}
        />
      </div>
    );
  };

  return { Modal, open, hide, showing };
};

export default useModal;
