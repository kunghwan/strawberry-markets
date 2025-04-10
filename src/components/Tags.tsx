"use client";

import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Form = ({
  Submit,
  children,
  className,
  ...props
}: ComponentProps<"form"> & { Submit?: ReactNode }) => {
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        if (props.onSubmit) {
          props.onSubmit(e);
        }
      }}
      className={twMerge(
        "max-w-100 mx-auto flex flex-col gap-y-2.5",
        className
      )}
    >
      {children}
      {Submit && <div>{Submit}</div>}
    </form>
  );
};
