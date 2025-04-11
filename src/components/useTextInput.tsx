"use client";

import {
  ChangeEvent,
  ComponentProps,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ComponentProps<"input"> {
  label?: string;
  labelClassName?: string;
  contentClassName?: string;
  containerClassName?: string;
  messageClassName?: string;
  onChangeText?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;

  message?: string | null;
  onSubmitEditing?: (
    value: string,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}

const useTextInput = () => {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const focus = useCallback(() => {
    setTimeout(() => ref.current?.focus(), 100);
  }, []);

  const TextInput = useCallback(
    ({
      message,
      label,
      labelClassName,
      onChangeText,
      contentClassName,
      containerClassName,
      messageClassName,
      onSubmitEditing,
      ...props
    }: Props) => {
      return (
        <div className={twMerge("gap-1", containerClassName)}>
          {label && (
            <label
              htmlFor={props?.id ?? inputId}
              className={twMerge("text-gray-500 text-xs", labelClassName)}
            >
              {label}
            </label>
          )}
          <div className={twMerge("h-12", contentClassName)}>
            <input
              {...props}
              id={props?.id ?? inputId}
              ref={ref}
              onKeyDown={(e) => {
                const { key, nativeEvent } = e;
                if (key === "Enter" && !nativeEvent.isComposing) {
                  if (onSubmitEditing) {
                    onSubmitEditing((e.target as HTMLInputElement).value, e);
                  }
                  if (props?.onKeyDown) {
                    props.onKeyDown(e);
                  }
                }
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(e) => {
                if (onChangeText) {
                  onChangeText(e.target.value, e);
                } else if (props?.onChange) {
                  props.onChange(e);
                }
              }}
              className={twMerge(
                "flex-1 w-full outline-none px-2.5 rounded border border-gray-200 focus:text-theme focus:border-theme",
                props?.className
              )}
            />
          </div>
          {message && (
            <label
              htmlFor={props?.id ?? inputId}
              className={twMerge("text-red-500 text-xs", messageClassName)}
            >
              {message}
            </label>
          )}
        </div>
      );
    },
    [inputId]
  );

  return { focused, ref, focus, TextInput };
};

export default useTextInput;
