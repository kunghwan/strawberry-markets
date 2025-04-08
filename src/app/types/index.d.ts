interface User {
  email: string;
  addresss: UserAddress[];
  mobile: string;
  name: string;
  createdAt: Date;
  sellerId: string | null; //판매자 사업자 등록번호
  uid?: string;
}
interface DBUser extends User {
  password: string; // client - no password
}
