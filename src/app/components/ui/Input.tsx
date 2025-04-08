import React from "react";
import { twMerge } from "tailwind-merge";

//
export const TextInput = ({
  label,
  divClassName,
  labelClassName,
  message,
  ...props
}: React.ComponentProps<"input"> & {
  label?: string;
  labelClassName?: string;
  divClassName?: string;
  message?: string | null;
}) => {
  return (
    <div className={twMerge("flex flex-col gap-y-1", divClassName)}>
      {message && (
        <label
          htmlFor={props?.id ?? props?.name}
          className={twMerge("text-xs text-gray-500 ", labelClassName)}
        >
          {message}
        </label>
      )}
      <input
        {...props}
        className={twMerge(
          "border border-pink-200 rounded h-12 px-2.5 outline-none focus:text-pink-500 focus:bg-transparent w-full transition focus:border-pink-300",
          props?.className
        )}
      />
    </div>
  );
};

//! preventDefault(), cn => flex, rowGap
export const Form = (props: React.ComponentProps<"form">) => (
  <form
    {...props}
    onSubmit={(e) => {
      e.preventDefault();
      if (props?.onSubmit) {
        props.onSubmit(e);
      }
    }}
    className={twMerge("flex flex-col gap-y-2.5", props?.className)}
  />
);

export const SubmitButton = (props: React.ComponentProps<"button">) => (
  <button
    {...props}
    className={twMerge(
      " rounded p-2.5 bg-pink-300 text-white",
      props?.className
    )}
  />
);
