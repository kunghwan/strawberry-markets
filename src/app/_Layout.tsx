"use client";

import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { AUTH } from "./context";
import { IconType } from "react-icons";
import {
  IoCartOutline,
  IoCubeOutline,
  IoGiftOutline,
  IoHomeOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoSearchOutline,
} from "react-icons/io5";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { usePathname, useRouter } from "next/navigation";
import { TbCherryFilled } from "react-icons/tb";

interface MenuProps {
  name: string;
  href: string;
  Icon: IconType;
}

const Root_Layout = ({ children }: PropsWithChildren) => {
  const { user } = AUTH.use();
  const router = useRouter(); // ✅ 선언

  const pathname = usePathname();

  const menus = useMemo<MenuProps[]>(() => {
    const items: MenuProps[] = [];

    const all: MenuProps = {
      name: "전체상품",
      href: "/products",
      Icon: IoGiftOutline,
    };
    const order: MenuProps = {
      name: "주문내역",
      href: "/orders",
      Icon: IoReceiptOutline,
    };
    const search: MenuProps = {
      name: "검색",
      href: "",
      Icon: IoSearchOutline,
    };

    if (!user) {
      items.push(
        all,
        {
          name: "로그인",
          href: "/signin",
          Icon: IoPersonOutline,
        },
        {
          name: "홈",
          href: "/",
          Icon: IoHomeOutline,
        },
        {
          name: "회원가입",
          href: "/signup",
          Icon: IoPersonAddOutline,
        }
      );
    } else {
      const isSeller = !!user.sellerId;

      if (!user.sellerId) {
        items.push(
          all,
          { ...order, href: `/order/${user.uid}/order` },

          {
            href: `/${user.uid}/products`,
            Icon: IoCubeOutline,
            name: "나의상품",
          },
          {
            href: `/${user.uid}/cart`,
            Icon: IoCartOutline,
            name: "장바구니",
          },
          search
        );
      }
    }

    console.log(user?.uid);

    return items;
  }, [user]);

  const [keyword, setKeyword] = useState("");
  const [isKeywordShowing, setIsKeywordShowing] = useState(false);
  const keywordRef = useRef<HTMLInputElement>(null);
  const focus = useCallback(
    () => setTimeout(() => keywordRef.current?.focus(), 500),
    []
  );

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-15 border-b border-gray-200 bg-white ">
        <div className="mx-auto max-w-225 flex ">
          <button
            className=" text-pink-500  h-15 text-xl items-center justify-center px-2.5 gap-x-2 flex "
            onClick={() => {
              if (pathname !== "/") {
                return router.push("/", { scroll: true });
              }
            }}
          >
            <TbCherryFilled className="text-2xl " />

            {!isKeywordShowing && "딸기마켓"}
          </button>
          {isKeywordShowing && (
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={isKeywordShowing ? "검색어 입력..." : undefined}
              className={twMerge(
                isKeywordShowing
                  ? "outline-none px-2.5 flex-1 bg-pink-50"
                  : "hidden"
              )}
              onBlur={() => setIsKeywordShowing(false)}
              ref={keywordRef}
              onKeyDown={(e) => {
                const { key, nativeEvent } = e;
                if (!nativeEvent.isComposing && key === "Enter") {
                  console.log("검색 ㄱㄱ");
                  setKeyword("");
                  setIsKeywordShowing(false);
                }
              }}
            />
          )}
        </div>
      </header>

      <main className="bg-pink-100 py-15 min-h-screen ">{children}</main>

      <nav className="fixed bottom-0 left-0 w-full h-15 border-t border-gray-200 bg-white">
        <ul className="flex">
          {menus.map((menu) => {
            const selected = pathname === menu.href; // 현재 페이지 경로와 비교해서 선택 여부 구현 가능

            return (
              <li key={menu.name} className="flex-1">
                <button
                  onClick={() => {
                    if (menu.href.length > 0) {
                      return router.push(menu.href, { scroll: true });
                    }
                    console.log(menu.name);
                    setIsKeywordShowing(true);
                    focus();
                  }}
                  className={twMerge(
                    "w-full h-15 flex justify-center items-center flex-col text-xs",
                    selected ? "text-pink-500" : "text-red-500"
                  )}
                >
                  <menu.Icon className="text-2xl" />
                  {menu.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Root_Layout;
