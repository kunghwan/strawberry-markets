"use client";

import {
  Ref,
  useCallback,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  ChangeEvent,
} from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";

export interface JusoRef {
  focusKeyword: () => void;
  openModal: () => void;
  focusNickname: () => void;
  focusDetail: () => void;
  closeModal: () => void;
}

interface Juso {
  id: string;
  roadAddr: string;
  zipNo: string;
  detail: string;
  nickname: string;
}

interface Props {
  jusoes: Juso[];
  onChangeJ: (jusoes: Juso[]) => void;
}

const cp = 20;

const JusoComponent = forwardRef<JusoRef, Props>(
  ({ jusoes, onChangeJ }, ref) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [items, setItems] = useState<Juso[]>(jusoes);
    const [keyword, setKeyword] = useState("");
    const [isModalShowing, setIsModalShowing] = useState(false);
    const [newJuso, setNewJuso] = useState<null | Juso>(null);

    const keywordRef = useRef<HTMLInputElement>(null);
    const nicknameRef = useRef<HTMLInputElement>(null);
    const detailRef = useRef<HTMLInputElement>(null);

    const keywordMessage = useMemo(() => {
      const split = keyword.trim().split(" ");
      if (split.length < 2 || !split[1]) {
        return "주소는 최소 2단어 이상 입력해주세요.";
      }
      return "";
    }, [keyword]);

    const onSearch = useCallback(
      async (isFetchMore?: boolean) => {
        if (keywordMessage) {
          alert(keywordMessage);
          keywordRef.current?.focus();
          return;
        }

        let page = currentPage;
        if (isFetchMore) {
          if (totalPage - page <= 0) return;
          page += 1;
        }

        const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?resultType=json&confmKey=${
          process.env.NEXT_PUBLIC_JUSO_API_KEY
        }&currentPage=${page}&countPerPage=${cp}&keyword=${encodeURIComponent(
          keyword
        )}`;

        try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.results.common.errorCode !== "0") {
            return alert(data.results.common.errorMessage);
          }

          const newItems = data.results.juso.map(
            (item: any): Juso => ({
              detail: "",
              id: item.bdMgtSn,
              nickname: "",
              roadAddr: item.roadAddr,
              zipNo: item.zipNo,
            })
          );

          if (isFetchMore) {
            setItems((prev) => [...prev, ...newItems]);
            setCurrentPage(page);
          } else {
            setItems(newItems);
            const cnt = Number(data.results.common.totalCount);
            setTotalPage(Math.ceil(cnt / cp));
            setCurrentPage(1);
          }

          setIsModalShowing(true);
        } catch (err) {
          alert("주소 검색 실패");
        }
      },
      [keyword, keywordMessage, currentPage, totalPage]
    );

    const JusoItem = useCallback((juso: Juso) => {
      const { roadAddr, zipNo } = juso;
      return (
        <button
          type="button"
          onClick={() => {
            setNewJuso(juso);
          }}
          className="justify-start text-left h-auto py-2.5 block border border-gray-200 w-full"
        >
          {roadAddr}
          <span className="p-1 primary rounded text-xs ml-2">{zipNo}</span>
        </button>
      );
    }, []);

    const MyJusoItem = useCallback(
      (juso: Juso) => {
        const { detail, id, nickname, roadAddr, zipNo } = juso;
        const onDelete = () => {
          const copy = jusoes.filter((item) => item.id !== juso.id);
          onChangeJ(copy);
          alert("삭제되었습니다");
          if (copy.length === 0) setIsModalShowing(false);
        };

        return (
          <div className="border border-gray-200 p-2.5 rounded gap-y-1 relative">
            <button
              className="text-theme border h-auto p-1 absolute top-1 right-1 text-xs"
              type="button"
              onClick={onDelete}
            >
              삭제
            </button>
            <p>{nickname}</p>
            <p>
              {roadAddr},<span>{zipNo}</span>,{detail}
            </p>
          </div>
        );
      },
      [jusoes, onChangeJ]
    );

    useImperativeHandle(ref, () => ({
      focusDetail: () => detailRef.current?.focus(),
      focusKeyword: () => keywordRef.current?.focus(),
      focusNickname: () => nicknameRef.current?.focus(),
      openModal: () => setIsModalShowing(true),
      closeModal: () => setIsModalShowing(false),
    }));

    return (
      <div>
        <div className="flex-row items-end">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="대전 중구 중앙로 121"
            ref={keywordRef}
            className="border px-3 py-2 rounded w-full"
            onKeyDown={(e) => {
              const { key, nativeEvent } = e;
              if (key === "Enter" && !nativeEvent.isComposing) {
                onSearch();
              }
            }}
          />
          <button
            className="primary size-12 text-2xl"
            type="button"
            onClick={() => onSearch()}
          >
            <IoSearchOutline />
          </button>
        </div>

        {jusoes.length > 0 && (
          <ul className="mt-4 space-y-2">
            {jusoes.map((juso) => (
              <li key={juso.id}>
                <MyJusoItem {...juso} />
              </li>
            ))}
          </ul>
        )}

        {isModalShowing && (
          <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end transition duration-200">
            <div className="bg-white w-full max-w-md h-[90%] rounded-t-2xl p-5 overflow-y-auto shadow-lg relative">
              <button
                onClick={() => setIsModalShowing(false)}
                className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-black"
                type="button"
              >
                <IoClose />
              </button>

              <h2 className="text-lg font-semibold mb-4">🔍 주소 검색 결과</h2>

              {items.length === 0 ? (
                <p className="text-gray-400">검색 결과가 없습니다.</p>
              ) : (
                <>
                  <ul className="space-y-3">
                    {items.map((juso, index) => (
                      <li
                        key={index}
                        className="p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          onChangeJ([juso]);
                          setIsModalShowing(false);
                        }}
                      >
                        <JusoItem {...juso} />
                      </li>
                    ))}
                  </ul>

                  {newJuso && (
                    <>
                      <input
                        placeholder="집/회사/직장 등"
                        value={newJuso.nickname}
                        onChange={(e) =>
                          setNewJuso({ ...newJuso, nickname: e.target.value })
                        }
                        ref={nicknameRef}
                        className="w-full border p-2 mt-2"
                      />
                      <p className="text-sm my-1">
                        {newJuso.roadAddr},{newJuso.zipNo}
                      </p>
                      <input
                        placeholder="510호"
                        value={newJuso.detail}
                        onChange={(e) =>
                          setNewJuso({ ...newJuso, detail: e.target.value })
                        }
                        ref={detailRef}
                        className="w-full border p-2"
                      />
                      <button
                        className="primary mt-2"
                        type="button"
                        onClick={() => {
                          if (newJuso.nickname.length === 0) {
                            alert("닉네임을 입력해주세요");
                            nicknameRef.current?.focus();
                            return;
                          }

                          if (newJuso.detail.length === 0) {
                            alert("상세주소를 입력해주세요");
                            detailRef.current?.focus();
                            return;
                          }

                          const found = jusoes.find(
                            (item) => item.id === newJuso.id
                          );
                          if (found) {
                            alert("중복된 주소입니다");
                            return;
                          }

                          onChangeJ([...jusoes, newJuso]);
                          setNewJuso(null);
                          setIsModalShowing(false);
                          setKeyword("");
                        }}
                      >
                        주소 추가하기
                      </button>
                    </>
                  )}

                  {items.length > 0 && totalPage > currentPage && (
                    <button
                      type="button"
                      className="text-theme mt-4"
                      onClick={() => onSearch(true)}
                    >
                      더 많은 주소 보기 ({totalPage - currentPage})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default JusoComponent;
