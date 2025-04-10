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
  containerClassName?: string;
  contentClassName?: string;
  onChangeText?: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
}

const useTextInput = () => {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const focus = useCallback(() => {
    setTimeout(() => ref.current?.focus(), 100);
  }, []);
  const inputId = useId();

  const TextInput = useCallback(
    ({
      label,
      containerClassName,
      contentClassName,
      labelClassName,
      onChangeText,
      ...props
    }: Props) => {
      return (
        <div className={twMerge("gap-1", containerClassName)}>
          {label && (
            <label
              htmlFor={props.id ?? inputId}
              className={twMerge("text-gray-500 text-xs", labelClassName)}
            >
              {label}
            </label>
          )}
          <div className={contentClassName}>
            <input
              {...props}
              id={props?.id ?? inputId}
              ref={ref}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(e) => {
                if (onChangeText) {
                  onChangeText(e.target.value, e);
                }
                if (props?.onChange) {
                  props.onChange(e);
                }
              }}
              className={twMerge(
                "flex-1 w-full outline-none px-5",
                props?.className
              )}
            />
          </div>
        </div>
      );
    },
    [inputId]
  );

  return { TextInput, focus, focused, ref };
};

export default useTextInput;
