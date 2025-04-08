// utils/validators.ts

// 이메일 유효성 검사
export const isEmail = (email: string): boolean => {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
  return regex.test(email);
};

export function emailValidator(email: string): string | null {
  if (!isEmail(email)) {
    return "잘못된 이메일 형식입니다.";
  }
  return null;
}

// 비밀번호 유효성 검사
export function passwordValidator(
  pwd: string,
  min: number = 6,
  max: number = 18
): string | null {
  if (pwd.length === 0) {
    return "비밀번호를 입력해주세요.";
  }
  if (pwd.length < min || pwd.length > max) {
    return `비밀번호는 ${min}~${max}자리여야 합니다.`;
  }
  return null;
}

// 한글 전체인지 확인
export const isKor = (text: string): boolean => {
  const korean = /^[가-힣]+$/;
  return korean.test(text);
};

// 자모(모음/자음)만 입력했는지 확인
export const isKorCharacter = (char: string): boolean => {
  const regex = /^[ㄱ-ㅎㅏ-ㅣ]+$/;
  return regex.test(char);
};

// 이름 유효성 검사
export function korValidator(name: string): string | null {
  const texts = Array.from(name);
  const foundSingleChar = texts.find((char) => isKorCharacter(char));
  if (foundSingleChar) {
    return "모음/자음만 입력할 수 없습니다.";
  }
  if (name.length < 2) {
    return "이름은 2글자 이상이어야 합니다.";
  }
  if (!isKor(name)) {
    return "이름은 한글만 입력 가능합니다.";
  }
  return null;
}

// 숫자 체크
export const isNum = (n: number | string): boolean => {
  const regex = /^[0-9]+$/;
  return regex.test(n.toString());
};

// 휴대폰 번호 유효성 검사
export function mobileValidator(mobile: string): string | null {
  if (!isNum(mobile)) {
    return "숫자만 입력해주세요.";
  }
  if (!mobile.startsWith("010")) {
    return "휴대폰 번호는 010으로 시작해야 합니다.";
  }
  if (mobile.length !== 11) {
    return "휴대폰 번호는 11자리여야 합니다.";
  }
  return null;
}
