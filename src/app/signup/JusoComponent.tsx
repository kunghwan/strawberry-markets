import axios from "axios";
import { useCallback, useMemo, useState, useTransition } from "react";
import { SubmitButton, TextInput } from "../components/ui/Input";
import { AiOutlineSearch } from "react-icons/ai";
import { Loading } from "../components/ui";

interface Juso {
  id: string;
  roadAddr: string;
  zipNo: string;
  rest: string;
}

interface JusoComponentProps {
  onChangeAddress: (address: Juso) => void;
  addresses: Juso[];
}

const JusoComponent = ({ onChangeAddress, addresses }: JusoComponentProps) => {
  const [keyword, setKeyword] = useState("");
  const [isShowing, setIsShowing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<Juso[]>([]);
  const [juso, setJuso] = useState<Juso | null>({
    id: "123123",
    rest: "",
    roadAddr: "",
    zipNo: "",
  });

  // 🔹 유효성 메시지
  const message = useMemo(() => {
    if (keyword.length === 0) {
      return "검색어를 입력해주세요";
    }
    return null;
  }, [keyword]);

  // 🔹 주소 검색 요청
  const onSubmit = useCallback(() => {
    if (message) {
      return alert(message);
    }

    startTransition(async () => {
      try {
        const { data } = await axios.post("/api/v0/juso", {
          keyword,
          currentPage: 1,
          countPerPage: 20,
        });

        setItems(
          data.map((item: any) => ({
            ...item,
            id: item.bgMgtSn,
          }))
        );
        setIsShowing(true);
      } catch (error: any) {
        alert(error.message);
      }
    });
  }, [keyword, message]);

  return (
    <div className="relative">
      {isPending && <Loading divClassName="bg-white/80" fixed />}

      <div className="flex items-end gap-x-2.5">
        <TextInput
          divClassName="flex-1"
          label="주소"
          id="keyword"
          name="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <SubmitButton onClick={onSubmit} className="px-2.5">
          <AiOutlineSearch />
        </SubmitButton>
        {message && <label className="text-red-400 text-xs">{message}</label>}
      </div>

      {isShowing && (
        <ul className="mt-2.5 flex flex-col gap-y-2.5">
          {items.map((jusoItem) => (
            <li key={jusoItem.id}>
              <button
                type="button"
                className="border w-full text-left h-10 px-2.5 rounded bg-gray-50/50"
                onClick={() => {
                  setIsShowing(false);
                  setJuso(jusoItem);
                }}
              >
                {jusoItem.roadAddr}, {jusoItem.zipNo}
              </button>
            </li>
          ))}
        </ul>
      )}

      {juso && (
        <div className="flex flex-col gap-y-2.5 mt-2.5">
          <div className="flex gap-x-2.5">
            <button className="h-12 border flex-1 text-left px-2.5 rounded bg-gray-50">
              {juso.roadAddr}
            </button>
            <SubmitButton
              type="button"
              onClick={onSubmit}
              className="px-2.5 h-12"
            >
              재검색
            </SubmitButton>
          </div>

          <div className="flex gap-x-2.5 items-end">
            <TextInput
              value={juso.rest}
              onChange={(e) =>
                setJuso((prev) => prev && { ...prev, rest: e.target.value })
              }
              name="rest"
              placeholder="501호"
              label="상세주소"
            />
            <SubmitButton
              type="button"
              className="px-2.5"
              onClick={() => {
                onChangeAddress(juso);
                setJuso(null);
              }}
            >
              기본 배송지 저장
            </SubmitButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default JusoComponent;
