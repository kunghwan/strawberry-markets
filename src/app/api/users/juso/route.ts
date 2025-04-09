import axios from "axios";
import response from "@/app/api";

export async function POST(req: Request) {
  const body = await req.json(); // body
  const { keyword, currentPage, countPerPage } = body;
  console.log(body, 7);

  if (!keyword) {
    return response.error("주소 검색어를 입력해주세요");
  }

  if (!currentPage || !countPerPage) {
    return response.error("파라미터값을 확인해주세요");
  }

  try {
    const { data } = await axios.get(process.env.NEXT_PUBLIC_JUSO_API_URL!, {
      params: {
        keyword,
        countPerPage,
        currentPage,
        resultType: "json",
        confmKey: process.env.NEXT_PUBLIC_JUSO_API_KEY,
      },
    });
    if (data.results.common.errorCode !== "0") {
      return response.error(data.results.common.errorCode);
    }

    console.log(data, 24);
    return response.success(data.results.juso);
  } catch (error: any) {
    return response.error(error.message);
  }
}
