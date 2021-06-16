import { UserAddressInfo } from "./user-address-info";

export class User extends UserAddressInfo {
  userID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  registerDate: Date;
  changePassword: boolean;
  status: boolean;
}
